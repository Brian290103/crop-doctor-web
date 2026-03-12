import { pgTable, uuid, text, vector, index } from "drizzle-orm/pg-core";

export const embeddings = pgTable(
  "embeddings",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    sourceId: uuid("source_id").notNull(),
    content: text("content").notNull(),
    // Updated dimensions to 1024
    embedding: vector("embedding", { dimensions: 1024 }).notNull(),
  },
  (table) => ({
    embeddingIndex: index("embedding_idx").using(
      "hnsw",
      table.embedding.op("vector_cosine_ops"),
    ),
  }),
);
