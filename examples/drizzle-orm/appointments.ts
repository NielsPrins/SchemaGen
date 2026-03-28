import {
  date,
  pgTable,
  text,
  time,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import { experience_packages } from "@/lib/database/schema/experience-packages";

export const appointments = pgTable("appointments", {
  id: uuid("id").primaryKey().defaultRandom(),

  experience_package_id: uuid()
    .notNull()
    .references(() => experience_packages.id),

  appointment_date: date().notNull(),
  time: time().notNull(),

  kwc: text().notNull(),

  customer_name: text().notNull(),
  customer_email: text().notNull(),
  customer_phone: text().notNull(),

  created_at: timestamp().notNull().defaultNow(),
});
