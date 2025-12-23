"use server";

import { client } from "../lib/sanity";
import { Certificate } from "../lib/interface";

export async function getCertificates() {
  const query = `*[_type == 'certificate'] | order(orderRank asc) {
    title,
    _id,
    description,
    tags
  }`;

  try {
    const data: Certificate[] = await client.fetch(query, {}, { next: { revalidate: 30 } });
    return data;
  } catch (error) {
    console.error("Error fetching certificates:", error);
    return [];
  }
}
