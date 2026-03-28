import { integer, pgTable, time, uuid } from "drizzle-orm/pg-core";
import { experience_packages } from "@/lib/database/schema/experience-packages";
import { relations } from "drizzle-orm";

export const experience_package_time_slots = pgTable(
  "experience_package_time_slots",
  {
    id: uuid("id").primaryKey().defaultRandom(),

    experience_package_id: uuid()
      .notNull()
      .references(() => experience_packages.id, { onDelete: "cascade" }),

    time: time().notNull(), // 10:00
    capacity: integer().notNull(),
  },
);

export const experience_package_time_slots_relations = relations(
  experience_package_time_slots,
  ({ one }) => ({
    experience_package: one(experience_packages, {
      fields: [experience_package_time_slots.experience_package_id],
      references: [experience_packages.id],
    }),
  }),
);
