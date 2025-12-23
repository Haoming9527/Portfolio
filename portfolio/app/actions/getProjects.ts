"use server";

import { client } from "../lib/sanity";
import { ProjectsCard } from "../lib/interface";

export async function getProjects() {
  const query = `*[_type == 'project'] | order(orderRank asc) {
    title,
    _id,
    link,
    description,
    tags
  }`;

  try {
    const data: ProjectsCard[] = await client.fetch(query, {}, { next: { revalidate: 30 } });
    return data;
  } catch (error) {
    console.error("Error fetching projects:", error);
    return [];
  }
}
