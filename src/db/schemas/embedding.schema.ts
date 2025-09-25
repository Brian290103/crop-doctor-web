import { index, pgTable, text, varchar, vector, uuid } from 'drizzle-orm/pg-core';
import { sources } from './source.schema';
import { relations } from "drizzle-orm";

export const embeddings = pgTable(
  'embeddings',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    sourceId: uuid('source_id').references(
      () => sources.id,
      { onDelete: 'cascade' }
    ),
    content: text('content').notNull(),
    embedding: vector('embedding', { dimensions: 768 }).notNull(),
  },
  (table) => ({
    embeddingIndex: index('embeddingIndex').using(
      'hnsw',
      table.embedding.op('vector_cosine_ops')
    ),
  })
);

export const embeddingsRelations = relations(embeddings, ({ one }) => ({
  source: one(sources, {
    fields: [embeddings.sourceId],
    references: [sources.id],
  }),
}));