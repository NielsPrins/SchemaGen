import { relations } from "drizzle-orm";
import { pgTable, primaryKey, uuid } from "drizzle-orm/pg-core";
import { experience_add_ons } from "@/lib/database/schema/experience-add-ons";
import { experience_packages } from "@/lib/database/schema/experience-packages";

export const experience_package_add_ons = pgTable(
  "experience_package_add_ons",
  {
    experience_package_id: uuid()
      .notNull()
      .references(() => experience_packages.id, { onDelete: "cascade" }),
    experience_add_on_id: uuid()
      .notNull()
      .references(() => experience_add_ons.id, { onDelete: "cascade" }),
  },
  (table) => [
    primaryKey({
      columns: [table.experience_package_id, table.experience_add_on_id],
    }),
  ],
);

export const experience_package_add_ons_relations = relations(
  experience_package_add_ons,
  ({ one }) => ({
    experience_package: one(experience_packages, {
      fields: [experience_package_add_ons.experience_package_id],
      references: [experience_packages.id],
    }),
    add_on: one(experience_add_ons, {
      fields: [experience_package_add_ons.experience_add_on_id],
      references: [experience_add_ons.id],
    }),
  }),
);
