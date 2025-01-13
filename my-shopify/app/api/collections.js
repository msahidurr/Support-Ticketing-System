import { json } from "@remix-run/node";
import { prisma } from "~/utils/prisma.server";

// Fetch all collections
export async function loader() {
  const collections = await prisma.collection.findMany({
    include: { products: true },
  });
  return json(collections);
}

// Create a new collection
export async function action({ request }) {
  const body = await request.json();
  const { name, priority, products } = body;

  const collection = await prisma.collection.create({
    data: {
      name,
      priority: priority || null,
      products: {
        create: products.map((product) => ({
          shopifyId: product.shopifyId,
          title: product.title,
          imageUrl: product.imageUrl,
        })),
      },
    },
  });

  return json(collection);
}
