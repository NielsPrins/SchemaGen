import { integer, pgTable, text, uuid } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { experience_package_add_ons } from "@/lib/database/schema/experience-package-add-ons";
import { experience_package_time_slots } from "@/lib/database/schema/experience-package-time-slots";

export const experience_packages = pgTable("experience_packages", {
  id: uuid().primaryKey().defaultRandom(),
  name: text().notNull(),
  day_of_week: integer().notNull(), // 1=maandag ... 7=zondag
});

export const experience_packages_relations = relations(
  experience_packages,
  ({ many }) => ({
    add_ons: many(experience_package_add_ons),
    time_slots: many(experience_package_time_slots),
  }),
);
