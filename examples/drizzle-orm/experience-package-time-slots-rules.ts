import { integer, pgTable, text, uuid } from "drizzle-orm/pg-core";
import { experience_packages } from "@/lib/database/schema/experience-packages";

export const experience_package_exception_rules = pgTable(
  "experience_package_exception_rules",
  {
    id: uuid().primaryKey().defaultRandom(),
    experience_package_id: uuid()
      .notNull()
      .references(() => experience_packages.id),

    name: text().notNull(), // e.g. "First Monday extended hours"

    // recurring monthly pattern
    week_of_month: integer("week_of_month"), // ordinal weekday occurrence: 1=first, 2=second, ..., 5=fifth
    day_of_week: integer("day_of_week"), // 1=Monday ... 7=Sunday
  },
);
