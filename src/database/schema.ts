import { pgTable, serial, timestamp, varchar } from 'drizzle-orm/pg-core';

export const elements = pgTable('elements', {
  id: serial('id').primaryKey(),
  type: varchar('type', { length: 256 }).notNull(),
  sessionId: varchar('session_id', { length: 256 }).notNull(),
  applicationId: varchar('application_id', { length: 256 }),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});
