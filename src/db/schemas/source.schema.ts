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

export const insertSourcesSchema = createInsertSchema(sources).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// We don’t import embeddings here anymore
export const selectSourcesSchema = createSelectSchema(sources)
  .extend({
    metadata: z.any().optional(),
    title: z.string().min(5),
    content: z.string().min(5),
    // embeddings will be added in the relations layer
  })
  .omit({
    createdAt: true,
    updatedAt: true,
  });

export type Source = z.infer<typeof selectSourcesSchema>;
