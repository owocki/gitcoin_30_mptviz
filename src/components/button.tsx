import { ReactNode } from "react";
import { tv } from "tailwind-variants";

const button = tv({
  base: "w-fit text-center leading-none flex-shrink-0 transition-all duration-300 tracking-[0.56px]",
  variants: {
    variant: {
      primary: "bg-sand text-moss-500  hover:bg-moss-300",
      secondary: "bg-transparent text-iris-900 border border-iris-900",
      tertiary:
        "bg-moss-900 text-moss-100 border border-moss-100 rounded-2xl hover:bg-moss-300",
      destructive:
        "bg-moss-900 text-red-500 border border-red-500 rounded-2xl hover:bg-moss-300",
      ghost: "bg-transparent ",
    },
    size: {
      lg: "py-3.5 px-5 rounded-md",
      sm: "py-1.5 px-2 rounded-md text-sm",
    },
    isLoading: {
      true: "opacity-50",
    },
    disabled: {
      true: "opacity-40 cursor-not-allowed",
    },
  },
});

export const Button = ({
  variant = "primary",
  size = "lg",
  onClick,
  isLoading,
  className,
  disabled,
  children,
  ...props
}: {
  variant?: "primary" | "secondary" | "ghost" | "tertiary" | "destructive";
  onClick?: (e: React.MouseEvent<HTMLElement>) => void;
  isLoading?: boolean;
  className?: string;
  children: ReactNode;
  disabled?: boolean;
  size?: "lg" | "sm";
} & React.ButtonHTMLAttributes<HTMLButtonElement>) => {
  return (
    <button
      disabled={!!isLoading || !!disabled}
      onClick={onClick}
      className={`${button({
        variant,
        size,
        isLoading: !!isLoading,
        disabled: !!disabled,
      })} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
