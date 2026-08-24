import { ArrowDownToSquare, Filmstrip, LogoGithub } from "@gravity-ui/icons";
import { Card, Chip, Heading, Paragraph } from "@heroui/react";
import type { Metadata } from "next";
import Image from "next/image";

import { ButtonLink } from "@/components/button-link";
import { ReleaseBoard } from "@/components/releases/release-board";
import { loadClassifiedReleases } from "@/lib/releases/load";
import { pickPrimaryAsset } from "@/lib/releases/types";
import {
  GITHUB_EDITOR_REPO,
  GITHUB_EDITOR_URL,
  GITHUB_ORG,
  PRODUCTS,
} from "@/lib/site";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Products",
  description: "Download Aphelion Editor and browse the product line. Builds sync from GitHub releases.",
};

export default async function ProductsPage(): Promise<React.ReactElement> {
  const classified = await loadClassifiedReleases(GITHUB_ORG, GITHUB_EDITOR_REPO);
  const latestAsset = classified.latest ? pickPrimaryAsset(classified.latest) : null;
  const downloadHref =
    latestAsset?.browser_download_url ?? classified.latest?.html_url ?? `${GITHUB_EDITOR_URL}/releases`;

  return (
    <div>
      <section className="release-hero border-b border-separator">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div className="animate-fade-up space-y-6">
            <Chip size="sm" variant="soft" color="accent">
              <Chip.Label>Aphelion Editor</Chip.Label>
            </Chip>
            <Heading level={1} className="text-4xl tracking-tight sm:text-6xl">
              The compositor. Fresh builds from GitHub.
            </Heading>
            <Paragraph className="max-w-xl text-lg text-muted">
              Latest GitHub release, plus the newest tag ending in{" "}
              <span className="font-mono text-foreground">-stable</span> when we
              cut one. Everything else stays in the archive below.
            </Paragraph>
            <div className="flex flex-wrap gap-3">
              <ButtonLink size="lg" href={downloadHref}>
                <ArrowDownToSquare className="size-5" />
                {classified.latest ? `Download ${classified.latest.tag_name}` : "Releases on GitHub"}
              </ButtonLink>
              <ButtonLink size="lg" href="/docs/editor" variant="secondary">
                Editor docs
              </ButtonLink>
              <ButtonLink size="lg" href={GITHUB_EDITOR_URL} variant="secondary" target="_blank" rel="noreferrer">
                <LogoGithub className="size-5" />
                Source
              </ButtonLink>
            </div>
          </div>
          <div className="animate-fade-up-delay overflow-hidden rounded-2xl border border-separator bg-surface shadow-[0_24px_48px_-8px_rgba(0,0,0,0.65)]">
            <Image
              src="/aphelion-editor-app-sample.png"
              alt="Aphelion Editor desktop workspace"
              width={1600}
              height={900}
              className="h-auto w-full"
              priority
            />
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-6xl space-y-12 px-4 py-12">
        <section id="downloads" className="scroll-mt-20 space-y-6">
          <div className="flex items-center gap-2">
            <Filmstrip className="size-5 text-accent" />
            <Heading level={2}>Editor releases</Heading>
          </div>
          <ReleaseBoard
            classified={classified}
            githubUrl={`${GITHUB_EDITOR_URL}/releases`}
            emptyLabel="No GitHub releases yet. Publish a release on aphelion-editor and it will appear here within a minute."
          />
        </section>

        <section className="space-y-4">
          <Heading level={2}>The line</Heading>
          <div className="grid gap-4 md:grid-cols-2">
            {PRODUCTS.map((product) => (
              <Card key={product.id}>
                <Card.Header>
                  <div className="flex items-center justify-between gap-3">
                    <Card.Title>{product.name}</Card.Title>
                    <Chip
                      size="sm"
                      color={product.status === "available" ? "success" : "default"}
                      variant="soft"
                    >
                      <Chip.Label>
                        {product.status === "available" ? "Available" : "Coming later"}
                      </Chip.Label>
                    </Chip>
                  </div>
                  <Card.Description>{product.tagline}</Card.Description>
                </Card.Header>
                <Card.Content>
                  <Paragraph size="sm" className="text-muted">
                    {product.description}
                  </Paragraph>
                </Card.Content>
              </Card>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
