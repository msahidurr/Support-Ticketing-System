import { useLoaderData } from "@remix-run/react";
import {
  Page,
  Layout,
  Card,
  ResourceList,
  ResourceItem,
  Badge,
  Thumbnail,
} from "@shopify/polaris";

export async function loader({request}) {
  const url = new URL(request.url);
  const response = await fetch(`${url.origin}/api/collections`);
  const collections = response.json();
  return collections;
}

export default function CollectionsPage() {
  const collections = useLoaderData();

  return (
    <Page title="Collections">
      <Layout>
        {collections.map((collection) => (
          <Layout.Section key={collection.id}>
            <Card title={collection.name} sectioned>
              <p>Name: {collection.name}</p>
              <p>
                Priority:{" "}
                {collection.priority ? (
                  <Badge status={getBadgeStatus(collection.priority)}>
                    {collection.priority}
                  </Badge>
                ) : (
                  "None"
                )}
              </p>
              <ResourceList
                resourceName={{ singular: "product", plural: "products" }}
                items={collection.products}
                renderItem={(product) => {
                  const { id, title, imageUrl } = product;
                  return (
                    <ResourceItem
                      id={id}
                      media={
                        <Thumbnail
                          source={imageUrl || ""}
                          alt={title}
                          size="small"
                        />
                      }
                      accessibilityLabel={`View details for ${title}`}
                    >
                      <h3>
                        {title}
                      </h3>
                    </ResourceItem>
                  );
                }}
              />
            </Card>
          </Layout.Section>
        ))}
      </Layout>
    </Page>
  );
}

function getBadgeStatus(priority) {
  switch (priority) {
    case "High":
      return "critical";
    case "Medium":
      return "attention";
    case "Low":
      return "info";
    default:
      return "default";
  }
}
