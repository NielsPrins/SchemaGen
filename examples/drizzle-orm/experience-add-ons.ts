import { integer, pgTable, text, uuid } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { experience_package_add_ons } from "@/lib/database/schema/experience-package-add-ons";

export const experience_add_ons = pgTable("experience_add_ons", {
  id: uuid().primaryKey().defaultRandom(),
  name: text().notNull(),
  description: text().notNull(),
  price: integer().notNull(), // in cents
});

export const experience_add_ons_relations = relations(
  experience_add_ons,
  ({ many }) => ({
    package_add_ons: many(experience_package_add_ons),
  }),
);
