import { Modules, ModulesDefinition } from "@medusajs/modules-sdk"
import { ProductDTO, ProductTypes } from "@medusajs/types"

import { WorkflowArguments } from "../../helper"

type HandlerInput = { products: ProductTypes.UpdateProductDTO[] }

export async function updateProducts({
  container,
  data,
}: WorkflowArguments<HandlerInput>): Promise<ProductDTO[]> {
  if (!data.products.length) {
    return []
  }

  const productModuleService: ProductTypes.IProductModuleService =
    container.resolve(ModulesDefinition[Modules.PRODUCT].registrationName)

  return await productModuleService.update(data.products)
}

updateProducts.aliases = {
  products: "products",
}
