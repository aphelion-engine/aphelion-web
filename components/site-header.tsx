"use client";

import { ArrowDownToSquare, Bars, Xmark } from "@gravity-ui/icons";
import { Button, Link } from "@heroui/react";
import NextLink from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

import { ButtonLink } from "@/components/button-link";
import { SITE_NAME } from "@/lib/site";

const NAV: readonly { href: string; label: string }[] = [
  { href: "/", label: "Home" },
  { href: "/products", label: "Products" },
  { href: "/docs", label: "Docs" },
  { href: "/sdk", label: "SDK" },
];

export function SiteHeader(): React.ReactElement {
  const pathname = usePathname();
  const [open, setOpen] = useState<boolean>(false);

  return (
    <header className="sticky top-0 z-40 border-b border-separator bg-surface-tertiary/95 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
        <NextLink href="/" className="flex items-center gap-2 text-sm font-semibold tracking-wide">
          <img
            src="/icon.svg"
            alt=""
            width={28}
            height={28}
            className="size-7 rounded-sm"
          />
          {SITE_NAME}
        </NextLink>
        <nav className="hidden items-center gap-1 md:flex">
          {NAV.map((item) => {
            const active =
              item.href === "/"
                ? pathname === "/"
                : pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={active ? "px-3 text-foreground" : "px-3 text-muted"}
              >
                {item.label}
              </Link>
            );
          })}
          <ButtonLink className="ml-2" size="sm" href="/sdk">
            <ArrowDownToSquare className="size-4" />
            Get SDK
          </ButtonLink>
        </nav>
        <Button
          isIconOnly
          className="md:hidden"
          variant="tertiary"
          aria-label={open ? "Close menu" : "Open menu"}
          onPress={() => setOpen((value) => !value)}
        >
          {open ? <Xmark className="size-5" /> : <Bars className="size-5" />}
        </Button>
      </div>
      {open ? (
        <div className="border-t border-separator px-4 py-3 md:hidden">
          <div className="flex flex-col gap-2">
            {NAV.map((item) => (
              <Link key={item.href} href={item.href} onPress={() => setOpen(false)}>
                {item.label}
              </Link>
            ))}
            <ButtonLink fullWidth href="/sdk" onClick={() => setOpen(false)}>
              <ArrowDownToSquare className="size-4" />
              Get SDK
            </ButtonLink>
          </div>
        </div>
      ) : null}
    </header>
  );
}
