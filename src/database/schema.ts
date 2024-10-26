import { relations } from 'drizzle-orm';
import {
  pgTable,
  serial,
  timestamp,
  varchar,
  text,
  integer,
} from 'drizzle-orm/pg-core';

export const elements = pgTable('elements', {
  id: serial('id').primaryKey(),
  type: varchar('type', { length: 256 }).notNull(),
  sessionId: varchar('session_id', { length: 256 }).notNull(),
  applicationId: varchar('application_id', { length: 256 }),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const sessions = pgTable('sessions', {
  id: serial('id').primaryKey(),
  ownerId: integer('owner_id').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const sessionsRelations = relations(sessions, ({ one }) => ({
  owner: one(users, {
    fields: [sessions.ownerId],
    references: [users.id],
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
