import NextLink from "next/link";
import type { ReactNode } from "react";

type ButtonVariant = "primary" | "secondary" | "ghost";

type ButtonSize = "sm" | "md" | "lg";

type ButtonLinkProps = {
  href: string;
  children: ReactNode;
  className?: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  isIconOnly?: boolean;
  target?: string;
  rel?: string;
  onClick?: () => void;
};

const VARIANT_CLASS: Record<ButtonVariant, string> = {
  primary: "aph-btn--primary",
  secondary: "aph-btn--secondary",
  ghost: "aph-btn--ghost",
};

const SIZE_CLASS: Record<ButtonSize, string> = {
  sm: "aph-btn--sm",
  md: "",
  lg: "aph-btn--lg",
};

function isNativeAnchor(href: string): boolean {
  return href.startsWith("http") || href.startsWith("/api/") || href.startsWith("mailto:");
}

/** Renders a link with the same bevel and pressed states as a Qt push button. */
export function ButtonLink({
  href,
  children,
  className,
  target,
  rel,
  onClick,
  variant = "primary",
  size = "md",
  fullWidth,
  isIconOnly,
}: ButtonLinkProps): React.ReactElement {
  const classes = [
    "aph-btn",
    VARIANT_CLASS[variant],
    SIZE_CLASS[size],
    isIconOnly ? "aph-btn--icon" : "",
    fullWidth ? "w-full" : "",
    className ?? "",
  ]
    .filter(Boolean)
    .join(" ");

  if (isNativeAnchor(href) || target === "_blank") {
    return (
      <a href={href} className={classes} target={target} rel={rel} onClick={onClick}>
        {children}
      </a>
    );
  }

  return (
    <NextLink href={href} className={classes} onClick={onClick}>
      {children}
    </NextLink>
  );
}
