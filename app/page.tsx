import { ArrowRight, Filmstrip, NodesRight, Puzzle } from "@gravity-ui/icons";
import { Card, Chip, Heading, Paragraph } from "@heroui/react";
import Image from "next/image";

import { ButtonLink } from "@/components/button-link";

export default function HomePage(): React.ReactElement {
  return (
    <div>
      <section className="border-b border-separator bg-[radial-gradient(ellipse_at_top,_#252525_0%,_#1e1e1e_55%)]">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div className="space-y-6">
            <Chip size="sm" variant="soft" color="accent">
              <Chip.Label>Product line</Chip.Label>
            </Chip>
            <Heading level={1} className="text-4xl tracking-tight sm:text-5xl">
              Professional tools. One Aphelion language.
            </Heading>
            <Paragraph className="max-w-xl text-muted" size="base">
              Aphelion is a series of apps built for people who live in dark,
              dense workspaces. Today that means Aphelion Editor — a node-based
              video compositor. Plugins for every product in the line start with
              the same SDK.
            </Paragraph>
            <div className="flex flex-wrap gap-3">
              <ButtonLink size="lg" href="/products">
                View products
                <ArrowRight className="size-4" />
              </ButtonLink>
              <ButtonLink size="lg" variant="secondary" href="/docs">
                Docs
              </ButtonLink>
              <ButtonLink size="lg" variant="secondary" href="/sdk">
                Download SDK
              </ButtonLink>
            </div>
          </div>
          <div className="overflow-hidden rounded-2xl border border-separator bg-surface shadow-[0_24px_48px_-8px_rgba(0,0,0,0.65),0_8px_16px_-4px_rgba(0,0,0,0.45)]">
            <Image
              src="/aphelion-editor-app-sample.png"
              alt="Aphelion Editor: timeline, node graph, and inspector in Aphelion Dark"
              width={1600}
              height={900}
              className="h-auto w-full rounded-2xl"
              priority
            />
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-4 px-4 py-16 sm:grid-cols-3">
        <Card>
          <Card.Header>
            <Filmstrip className="size-5 text-accent" />
            <Card.Title>Editor first</Card.Title>
            <Card.Description>
              A compositor-grade desktop app: graphs, clips, and panels that stay out of the way.
            </Card.Description>
          </Card.Header>
        </Card>
        <Card>
          <Card.Header>
            <Puzzle className="size-5 text-accent" />
            <Card.Title>One plugin SDK</Card.Title>
            <Card.Description>
              Write effects, panels, and dialogs once. The SDK is the public surface for every Aphelion product.
            </Card.Description>
          </Card.Header>
        </Card>
        <Card>
          <Card.Header>
            <NodesRight className="size-5 text-accent" />
            <Card.Title>Same chrome</Card.Title>
            <Card.Description>
              Charcoal panels, cool accent, tight radii — the website matches the editor you already use.
            </Card.Description>
          </Card.Header>
        </Card>
      </section>
    </div>
  );
}
