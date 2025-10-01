import { relations } from "drizzle-orm";
import {
  jsonb,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { crops } from "./crop.schema";
import { embeddings } from "./embedding.schema";

export const resourceTypeEnum = pgEnum("resource_type", [
  "text",
  "website",
  "file",
]);

export const sources = pgTable("sources", {
  id: uuid("id").defaultRandom().primaryKey(),
  slug: text("slug").notNull().unique(),
  cropId: uuid("crop_id")
    .notNull()
    .references(() => crops.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  content: text("content").notNull(),
  type: resourceTypeEnum("type").notNull(),
  metadata: jsonb("metadata"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const sourcesRelations = relations(sources, ({ many }) => ({
  embeddings: many(embeddings),
}));

export const insertSourcesSchema = createInsertSchema(sources).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const selectEmbeddingsSchema = createSelectSchema(embeddings).omit({
  sourceId: true,
  embedding: true,
});

export const selectSourcesSchema = createSelectSchema(sources)
  .extend({
    metadata: z.any().optional(),
    title: z.string().min(5),
    content: z.string().min(5),
    embeddings: z.array(selectEmbeddingsSchema).optional(),
  })
  .omit({
    createdAt: true,
    updatedAt: true,
  });

export type Source = z.infer<typeof selectSourcesSchema>;
