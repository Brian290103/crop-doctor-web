'use server';

import { revalidatePath } from 'next/cache';
import { getSlug } from '@/lib/utils';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

export const getCrops = async () => {
  const res = await fetch(`${BASE_URL}/api/crops`);
  return res.json();
};

export const getCrop = async (id: string) => {
  const res = await fetch(`${BASE_URL}/api/crops/${id}`);
  return res.json();
};

export const createCrop = async (data: { name: string }) => {
  const slug = getSlug(data.name);
  const res = await fetch(`${BASE_URL}/api/crops`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ ...data, slug }),
  });
  revalidatePath('/dashboard/sources');
  return res.json();
};

export const updateCrop = async (id: string, data: { name: string }) => {
  const slug = getSlug(data.name);
  const res = await fetch(`${BASE_URL}/api/crops/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ ...data, slug }),
  });
  revalidatePath('/dashboard/sources');
  return res.json();
};

export const deleteCrop = async (id: string) => {
  const res = await fetch(`${BASE_URL}/api/crops/${id}`, {
    method: 'DELETE',
  });
  revalidatePath('/dashboard/sources');
  return res.json();
};