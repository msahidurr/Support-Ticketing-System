import { useLoaderData } from "@remix-run/react";

export async function loader() {
  const response = await fetch("/api/collections");
  const collections = await response.json();
  return collections;
}

export default function CollectionsPage() {
  const collections = useLoaderData();

  return (
    <div>
      <h1>Collections</h1>
      <ul>
        {collections.map((collection) => (
          <li key={collection.id}>
            <h2>{collection.name}</h2>
            <p>Priority: {collection.priority || "None"}</p>
            <ul>
              {collection.products.map((product) => (
                <li key={product.id}>
                  <img src={product.imageUrl} alt={product.title} width="50" />
                  <p>{product.title}</p>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
}
