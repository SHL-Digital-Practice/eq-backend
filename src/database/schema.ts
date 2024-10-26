import { pgTable, serial, varchar } from 'drizzle-orm/pg-core';

export const elements = pgTable('elements', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 256 }),
});
