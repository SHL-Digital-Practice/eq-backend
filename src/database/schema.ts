import { relations } from 'drizzle-orm';
import {
  pgTable,
  serial,
  timestamp,
  varchar,
  text,
  integer,
  json,
} from 'drizzle-orm/pg-core';

export const sessions = pgTable('sessions', {
  id: serial('id').primaryKey(),
  ownerId: integer('owner_id').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});
export const sessionsRelations = relations(sessions, ({ one, many }) => ({
  owner: one(users, {
    fields: [sessions.ownerId],
    references: [users.id],
  }),
  elements: many(elements),
}));

export const elements = pgTable('elements', {
  id: serial('id').primaryKey(),
  type: varchar('type', { length: 256 }).notNull(),
  sessionId: integer('session_id'),
  applicationId: varchar('application_id', { length: 256 }),
  properties: json('properties')
    .$type<Record<string, any>>()
    .default({})
    .notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const elementsRelations = relations(elements, ({ one }) => ({
  session: one(sessions, {
    fields: [elements.sessionId],
    references: [sessions.id],
  }),
}));

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 256 }).notNull(),
  avatar: text('avatar'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const userRelations = relations(users, ({ many }) => ({
  sessions: many(sessions),
}));
