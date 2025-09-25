import {
  index,
  pgTable,
  text,
  timestamp,
  uuid,
  vector,
} from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

export const crops = pgTable(
  "crops",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    slug: text("slug").notNull().unique(),
    name: text("name").notNull(),
    embedding: vector("embedding", { dimensions: 768 }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => ({
    embeddingIndex: index("crop_embedding_index").using(
      "hnsw",
      table.embedding.op("vector_cosine_ops"),
    ),
  }),
);

export const insertCropsSchema = createInsertSchema(crops).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const selectCropsSchema = createSelectSchema(crops)
  .extend({
    name: z.string().min(3),
    slug: z.string().min(3),
  })
  .omit({
    id: true,
    createdAt: true,
    updatedAt: true,
  });
