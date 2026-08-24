import { ArrowDownToSquare, Filmstrip } from "@gravity-ui/icons";
import { Card, Chip, Heading, Paragraph } from "@heroui/react";
import type { Metadata } from "next";
import Image from "next/image";

import { ButtonLink } from "@/components/button-link";
import { PRODUCTS } from "@/lib/site";

export const metadata: Metadata = {
  title: "Products",
  description: "Aphelion products. Aphelion Editor is available; more apps in the line are coming later.",
};

export default function ProductsPage(): React.ReactElement {
  return (
    <div className="mx-auto max-w-6xl space-y-12 px-4 py-16">
      <div className="max-w-2xl space-y-4">
        <Heading level={1}>Products</Heading>
        <Paragraph className="text-muted">
          Aphelion is a line of professional apps that share a dark UI, a
          compositor mindset, and a common plugin SDK. Aphelion Editor is the
          product that ships today.
        </Paragraph>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {PRODUCTS.map((product) => (
          <Card key={product.id} id={product.id === "editor" ? undefined : product.id}>
            <Card.Header>
              <div className="flex items-center justify-between gap-3">
                <Card.Title>{product.name}</Card.Title>
                <Chip size="sm" color={product.status === "available" ? "success" : "default"} variant="soft">
                  <Chip.Label>{product.status === "available" ? "Available" : "Coming later"}</Chip.Label>
                </Chip>
              </div>
              <Card.Description>{product.tagline}</Card.Description>
            </Card.Header>
            <Card.Content>
              <Paragraph size="sm" className="text-muted">
                {product.description}
              </Paragraph>
            </Card.Content>
            {product.status === "available" ? (
              <Card.Footer className="flex gap-2">
                <ButtonLink size="sm" variant="secondary" href={product.href}>
                  See Editor
                </ButtonLink>
                {product.docsHref ? (
                  <ButtonLink size="sm" href={product.docsHref}>
                    Docs
                  </ButtonLink>
                ) : null}
              </Card.Footer>
            ) : null}
          </Card>
        ))}
      </div>

      <section id="editor" className="scroll-mt-20 space-y-6">
        <div className="flex items-center gap-2">
          <Filmstrip className="size-5 text-accent" />
          <Heading level={2}>Aphelion Editor</Heading>
        </div>
        <div className="overflow-hidden rounded-md border border-separator bg-surface">
          <Image
            src="/aphelion-editor-app-sample.png"
            alt="Aphelion Editor desktop workspace"
            width={1600}
            height={900}
            className="h-auto w-full"
          />
        </div>
        <div className="flex flex-wrap gap-3">
          <ButtonLink href="/docs/editor">
            Editor docs
          </ButtonLink>
          <ButtonLink href="/sdk" variant="secondary">
            <ArrowDownToSquare className="size-4" />
            Build plugins
          </ButtonLink>
        </div>
      </section>
    </div>
  );
}
