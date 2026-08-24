import { LogoGithub } from "@gravity-ui/icons";
import { Link, Separator } from "@heroui/react";

import { GITHUB_EDITOR_URL, SITE_NAME } from "@/lib/site";

export function SiteFooter(): React.ReactElement {
  return (
    <footer className="mt-auto border-t border-separator bg-surface-tertiary">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-8 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted">
          {SITE_NAME} — a family of professional creative apps. Dark by default.
        </p>
        <div className="flex items-center gap-4">
          <Link href="/products">Products</Link>
          <Separator orientation="vertical" className="h-4" />
          <Link href="/docs">Docs</Link>
          <Separator orientation="vertical" className="h-4" />
          <Link href="/sdk">SDK</Link>
          <Separator orientation="vertical" className="h-4" />
          <Link href={GITHUB_EDITOR_URL} target="_blank" rel="noreferrer">
            <LogoGithub className="size-4" />
            GitHub
          </Link>
        </div>
      </div>
    </footer>
  );
}
