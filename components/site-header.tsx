"use client";

import { Bars, Xmark } from "@gravity-ui/icons";
import Image from "next/image";
import NextLink from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

import { ButtonLink } from "@/components/button-link";
import { GITHUB_EDITOR_URL, SITE_NAME } from "@/lib/site";

const NAV: readonly { href: string; label: string }[] = [
  { href: "/features", label: "Features" },
  { href: "/docs", label: "Docs" },
  { href: "/plugins", label: "Plugins" },
  { href: "/sdk", label: "SDK" },
];

function isActive(pathname: string, href: string): boolean {
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function SiteHeader(): React.ReactElement {
  const pathname = usePathname();
  const [open, setOpen] = useState<boolean>(false);

  // The panel closes from the link handlers rather than an effect on
  // `pathname`; a routes-change effect would trigger an extra render pass.
  const closeMenu = () => setOpen(false);

  return (
    <header className="aph-menubar sticky top-0 z-40">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-4 px-4">
        <NextLink href="/" className="aph-menubar__brand">
          {/* unoptimized: the optimizer refuses SVG unless dangerouslyAllowSVG
              is set, and there is nothing to gain re-encoding a 22px mark. */}
          <Image src="/icon.svg" alt="" width={22} height={22} unoptimized className="size-[22px]" />
          {SITE_NAME}
        </NextLink>

        <nav aria-label="Main" className="hidden items-center gap-1 md:flex">
          {NAV.map((item) => (
            <NextLink
              key={item.href}
              href={item.href}
              aria-current={isActive(pathname, item.href) ? "page" : undefined}
              className="aph-menubar__item"
            >
              {item.label}
            </NextLink>
          ))}
          <a
            href={GITHUB_EDITOR_URL}
            target="_blank"
            rel="noreferrer"
            className="aph-menubar__item"
          >
            GitHub
          </a>
          <ButtonLink className="ml-2" size="sm" href="/editor">
            Download
          </ButtonLink>
        </nav>

        <button
          type="button"
          className="aph-btn aph-btn--ghost aph-btn--icon md:hidden"
          aria-expanded={open}
          aria-controls="mobile-nav"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((value) => !value)}
        >
          {open ? <Xmark className="size-5" /> : <Bars className="size-5" />}
        </button>
      </div>

      <div
        id="mobile-nav"
        hidden={!open}
        className="border-t border-[#121212] px-4 py-3 md:hidden"
      >
        <nav aria-label="Main" className="flex flex-col gap-1">
          {NAV.map((item) => (
            <NextLink
              key={item.href}
              href={item.href}
              aria-current={isActive(pathname, item.href) ? "page" : undefined}
              className="aph-menubar__item"
              onClick={closeMenu}
            >
              {item.label}
            </NextLink>
          ))}
          <a
            href={GITHUB_EDITOR_URL}
            target="_blank"
            rel="noreferrer"
            className="aph-menubar__item"
            onClick={closeMenu}
          >
            GitHub
          </a>
          <ButtonLink className="mt-2" fullWidth href="/editor" onClick={closeMenu}>
            Download
          </ButtonLink>
        </nav>
      </div>
    </header>
  );
}
