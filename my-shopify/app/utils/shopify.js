import { shopifyApi, ApiVersion } from "@shopify/shopify-api";

const shopify = shopifyApi({
  apiKey: process.env.SHOPIFY_API_KEY,
  apiSecretKey: process.env.SHOPIFY_API_SECRET,
  scopes: ["read_products"],
  hostName: process.env.HOST_NAME,
  apiVersion: ApiVersion.July23,
});

export async function fetchProducts(session) {
  const client = new shopify.clients.Graphql({ session });

  const query = `
    {
      products(first: 50) {
        edges {
          node {
            id
            title
            images(first: 1) {
              edges {
                node {
                  originalSrc
                }
              }
            }
          }
        }
      }
    }
  `;

  const response = await client.query({ data: query });
  return response.body.data.products.edges.map(edge => ({
    shopifyId: edge.node.id,
    title: edge.node.title,
    imageUrl: edge.node.images.edges[0]?.node.originalSrc || null,
  }));
}
