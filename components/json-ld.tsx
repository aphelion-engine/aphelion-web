/**
 * Renders a JSON-LD document into the server-rendered HTML.
 *
 * A plain `<script type="application/ld+json">` is what search engines parse;
 * Next's `<Script>` component would defer it into the client bundle, which is
 * the opposite of what structured data wants.
 */

import type { JsonLdNode } from "@/lib/seo";

type JsonLdProps = {
  data: JsonLdNode | readonly JsonLdNode[];
};

export function JsonLd({ data }: JsonLdProps): React.ReactElement {
  return (
    <script
      type="application/ld+json"
      // The payload is built from typed objects in this repository, never from
      // user input, so there is no injection path. `<` is still escaped
      // because a `</script>` inside a string would end the element early.
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}
