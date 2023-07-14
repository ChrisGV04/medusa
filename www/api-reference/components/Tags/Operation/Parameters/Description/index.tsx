import Loading from "@/components/Loading"
import type { InlineCodeProps } from "@/components/MDXComponents/InlineCode"
import type { SchemaObject } from "@/types/openapi"
import clsx from "clsx"
import dynamic from "next/dynamic"
import Link from "next/link"

const InlineCode = dynamic<InlineCodeProps>(
  async () => import("../../../../MDXComponents/InlineCode"),
  {
    loading: () => <Loading />,
  }
) as React.FC<InlineCodeProps>

type TagOperationParametersDescriptionProps = {
  schema: SchemaObject
}

const TagOperationParametersDescription = ({
  schema,
}: TagOperationParametersDescriptionProps) => {
  let typeDescription: React.ReactNode = <></>
  switch (true) {
    case schema.type === "object":
      typeDescription = (
        <>
          {schema.type} {schema.title ? `(${schema.title})` : ""}
        </>
      )
      break
    case schema.type === "array":
      typeDescription = (
        <>{schema.type === "array" && formatArrayDescription(schema.items)}</>
      )
      break
    case schema.anyOf !== undefined:
    case schema.allOf !== undefined:
      typeDescription = <>{formatUnionDescription(schema.allOf)}</>
      break
    case schema.oneOf !== undefined:
      typeDescription = (
        <>
          {schema.oneOf?.map((item, index) => (
            <>
              {index !== 0 && <> or </>}
              {item.title || item.type}
            </>
          ))}
        </>
      )
      break
    default:
      typeDescription = <>{schema.type}</>
  }
  return (
    <div
      className={clsx(
        "w-2/3 pb-0.5",
        "border-medusa-border-base dark:border-medusa-border-base-dark border-b border-solid"
      )}
    >
      {typeDescription}
      {schema.example && (
        <>
          <br />
          <span>
            Example:{" "}
            <InlineCode className="break-words">
              {JSON.stringify(schema.example)}
            </InlineCode>
          </span>
        </>
      )}

      {schema.default && (
        <>
          <br />
          <span>
            Default:{" "}
            <InlineCode className="break-words">
              {JSON.stringify(schema.default)}
            </InlineCode>
          </span>
        </>
      )}
      {schema.description && (
        <>
          <br />
          <span>{schema.description}</span>
        </>
      )}
      {schema.externalDocs && (
        <>
          <br />
          <Link
            href={schema.externalDocs.url}
            className={clsx(
              "text-medusa-text-base hover:text-medusa-text-subtle",
              "dark:text-medusa-text-base-dark dark:hover:text-medusa-text-subtle-dark"
            )}
            target="_blank"
          >
            {schema.externalDocs.description || "Read More"}
          </Link>
        </>
      )}
    </div>
  )
}

export default TagOperationParametersDescription

function formatArrayDescription(schema?: SchemaObject) {
  if (!schema) {
    return "Array"
  }

  const type =
    schema.type === "object"
      ? `objects ${schema.title ? `(${schema.title})` : ""}`
      : `${schema.type}s`

  return `Array of ${type}`
}

function formatUnionDescription(arr?: SchemaObject[]) {
  const types = [...new Set(arr?.map((type) => type.type))]
  return <>{types.join(" or ")}</>
}