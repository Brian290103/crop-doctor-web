// src/db/relations.ts
import { sources } from "./source.schema";
import { embeddings } from "./embedding.schema";
import { relations } from "drizzle-orm";

export const sourcesRelations = relations(sources, ({ many }) => ({
  embeddings: many(embeddings),
}));

export const embeddingsRelations = relations(embeddings, ({ one }) => ({
  source: one(sources, {
    fields: [embeddings.sourceId],
    references: [sources.id],
  }),
}));
