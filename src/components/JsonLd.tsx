/**
 * Injects a JSON-LD structured-data block. Server-rendered into the HTML so
 * search engines and generative engines (GEO) can parse it directly.
 */
export function JsonLd({ data }: { data: object | object[] }) {
  return (
    <script
      type="application/ld+json"
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
