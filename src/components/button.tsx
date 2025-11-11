import { ReactNode } from "react";
import { tv } from "tailwind-variants";

const button = tv({
  base: "w-fit text-center leading-none flex-shrink-0 transition-all duration-300 text-sm font-mono leading-5 tracking-[0.56px]",
  variants: {
    variant: {
      primary: "bg-sand text-moss-500  hover:bg-moss-300",
      secondary: "",
      ghost: "bg-transparent ",
    },
    size: {
      lg: "py-3.5 px-5 rounded-md",
      sm: "py-2.5 px-3 rounded-md",
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
  variant?: "primary" | "secondary" | "ghost";
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
