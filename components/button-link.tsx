import type { ButtonVariants } from "@heroui/react";
import { buttonVariants } from "@heroui/react";
import NextLink from "next/link";
import type { ReactNode } from "react";

type ButtonLinkProps = ButtonVariants & {
  href: string;
  children: ReactNode;
  className?: string;
  target?: string;
  rel?: string;
  onClick?: () => void;
};

function isNativeAnchor(href: string): boolean {
  return href.startsWith("http") || href.startsWith("/api/") || href.startsWith("mailto:");
}

export function ButtonLink({
  href,
  children,
  className,
  target,
  rel,
  onClick,
  variant,
  size,
  fullWidth,
  isIconOnly,
}: ButtonLinkProps): React.ReactElement {
  const classes = buttonVariants({
    className,
    variant,
    size,
    fullWidth,
    isIconOnly,
  });

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
