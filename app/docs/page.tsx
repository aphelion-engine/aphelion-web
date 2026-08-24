import { BookOpen } from "@gravity-ui/icons";
import { Card, Heading, Paragraph } from "@heroui/react";
import type { Metadata } from "next";

import { ButtonLink } from "@/components/button-link";
import { DOCS_SOURCES } from "@/lib/docs/catalog";
import { listDocsPages } from "@/lib/docs/load";

export const revalidate = 120;

export const metadata: Metadata = {
  title: "Docs",
  description: "Documentation for Aphelion products and the plugin SDK, synced from GitHub.",
};

export default async function DocsIndexPage(): Promise<React.ReactElement> {
  const catalogs = await Promise.all(
    DOCS_SOURCES.map(async (source) => ({
      source,
      pages: await listDocsPages(source),
    })),
  );

  return (
    <div className="mx-auto max-w-6xl space-y-10 px-4 py-16">
      <div className="max-w-2xl space-y-4">
        <Heading level={1}>Documentation</Heading>
        <Paragraph className="text-muted">
          Guides are pulled from GitHub on a short cache, so new markdown in{" "}
          <a className="text-accent" href="https://github.com/aphelion-engine/aphelion-editor">
            aphelion-editor
          </a>{" "}
          and{" "}
          <a className="text-accent" href="https://github.com/aphelion-engine/aphelion-sdk">
            aphelion-sdk
          </a>{" "}
          shows up here without copying files into the website.
        </Paragraph>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {catalogs.map(({ source, pages }) => (
          <Card key={source.id}>
            <Card.Header>
              <BookOpen className="size-5 text-accent" />
              <Card.Title>{source.label}</Card.Title>
              <Card.Description>{source.description}</Card.Description>
            </Card.Header>
            <Card.Content>
              <p className="text-sm text-muted">{pages.length} pages synced</p>
            </Card.Content>
            <Card.Footer>
              <ButtonLink size="sm" href={`/docs/${source.id}`}>
                Open docs
              </ButtonLink>
            </Card.Footer>
          </Card>
        ))}
      </div>
    </div>
  );
}
