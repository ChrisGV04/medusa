import React from "react"
import { IconProps } from ".."

const IconChevronDoubleLeftMiniSolid: React.FC<IconProps> = ({
  iconColorClassName,
  ...props
}) => {
  return (
    <svg
      width={props.width || 20}
      height={props.height || 20}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M15.79 14.77C15.6521 14.9131 15.4629 14.9957 15.2641 14.9994C15.0654 15.0032 14.8733 14.9278 14.73 14.79L10.23 10.54C10.1574 10.47 10.0997 10.3862 10.0602 10.2934C10.0208 10.2006 10.0005 10.1008 10.0005 10C10.0005 9.89919 10.0208 9.79941 10.0602 9.70663C10.0997 9.61385 10.1574 9.52997 10.23 9.46001L14.73 5.21001C14.8002 5.13826 14.8841 5.08133 14.9767 5.0426C15.0693 5.00386 15.1687 4.98411 15.2691 4.9845C15.3695 4.9849 15.4687 5.00544 15.561 5.04491C15.6533 5.08437 15.7367 5.14196 15.8064 5.21427C15.876 5.28657 15.9304 5.37211 15.9663 5.46582C16.0023 5.55953 16.0191 5.65951 16.0157 5.75982C16.0123 5.86014 15.9888 5.95875 15.9466 6.04983C15.9044 6.1409 15.8444 6.22257 15.77 6.29001L11.832 10L15.77 13.71C15.9131 13.848 15.9957 14.0371 15.9994 14.2359C16.0032 14.4346 15.9278 14.6267 15.79 14.77ZM9.79001 14.77C9.65205 14.9131 9.46291 14.9957 9.26415 14.9994C9.06539 15.0032 8.87327 14.9278 8.73001 14.79L4.23001 10.54C4.15742 10.47 4.09968 10.3862 4.06025 10.2934C4.02081 10.2006 4.00049 10.1008 4.00049 10C4.00049 9.89919 4.02081 9.79941 4.06025 9.70663C4.09968 9.61385 4.15742 9.52997 4.23001 9.46001L8.73001 5.21001C8.8002 5.13826 8.88408 5.08133 8.97668 5.0426C9.06928 5.00386 9.16871 4.98411 9.26908 4.9845C9.36945 4.9849 9.46873 5.00544 9.56102 5.04491C9.6533 5.08437 9.73673 5.14196 9.80635 5.21427C9.87598 5.28657 9.93038 5.37211 9.96634 5.46582C10.0023 5.55953 10.0191 5.65951 10.0157 5.75982C10.0123 5.86014 9.98881 5.95875 9.9466 6.04983C9.9044 6.1409 9.84435 6.22257 9.77001 6.29001L5.83201 10L9.77001 13.71C9.91314 13.848 9.99565 14.0371 9.9994 14.2359C10.0032 14.4346 9.92784 14.6267 9.79001 14.77Z"
        className={
          iconColorClassName ||
          "fill-medusa-fg-subtle dark:fill-medusa-fg-subtle-dark"
        }
      />
    </svg>
  )
}

export default IconChevronDoubleLeftMiniSolid