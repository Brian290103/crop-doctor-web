"use server";

import { revalidatePath } from "next/cache";
import { getSlug } from "@/lib/utils";
import { createEmbeddings, deleteEmbeddings } from "./embedding.actions";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

export const getSources = async (cropId?: string) => {
  console.log("getSources", cropId);
  const url = cropId
    ? `${BASE_URL}/api/sources?cropId=${cropId}`
    : `${BASE_URL}/api/sources`;
  const res = await fetch(url);
  console.log("res", res);
  return res.json();
};

export const getSource = async (id: string) => {
  const res = await fetch(`${BASE_URL}/api/sources/${id}`);
  return res.json();
};

export const createSource = async (data: {
  cropId: string;
  title: string;
  content: string;
  type: string;
  metadata?: any;
}) => {
  const slug = getSlug(data.title);
  const res = await fetch(`${BASE_URL}/api/sources`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ ...data, slug }),
  });
  revalidatePath("/dashboard/sources");
  return res.json();
};

export const updateSource = async (
  id: string,
  data: {
    cropId?: string;
    title?: string;
    content?: string;
    type?: string;
    metadata?: any;
  },
) => {
  const slug = data.title ? getSlug(data.title) : undefined;
  const res = await fetch(`${BASE_URL}/api/sources/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ ...data, slug }),
  });
  revalidatePath("/dashboard/sources");
  return res.json();
};

export const deleteSource = async (id: string) => {
  const res = await fetch(`${BASE_URL}/api/sources/${id}`, {
    method: "DELETE",
  });
  revalidatePath("/dashboard/sources");
  return res.json();
};

export const trainSourceEmbeddings = async (sourceId: string) => {
  try {
    await createEmbeddings(sourceId);
    revalidatePath("/dashboard/sources");
    return { success: true, message: "Embeddings created successfully." };
  } catch (error) {
    console.error("Error training source embeddings:", error);
    return { success: false, message: "Failed to create embeddings." };
  }
};
