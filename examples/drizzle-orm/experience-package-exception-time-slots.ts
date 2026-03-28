import { integer, pgTable, time, uuid } from "drizzle-orm/pg-core";
import { experience_package_exception_rules } from "@/lib/database/schema/experience-package-time-slots-rules";

export const experience_package_exception_time_slots = pgTable(
  "experience_package_exception_time_slots",
  {
    id: uuid().primaryKey().defaultRandom(),

    exception_rule_id: uuid()
      .notNull()
      .references(() => experience_package_exception_rules.id),

    time: time().notNull(), // 10:00
    capacity: integer().notNull(),
  },
);
