import { pgTable, text, serial, integer, timestamp, decimal } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const airports = pgTable("airports", {
  id: serial("id").primaryKey(),
  code: text("code").notNull().unique(),
  name: text("name").notNull(),
  city: text("city").notNull(),
});

export const flights = pgTable("flights", {
  id: serial("id").primaryKey(),
  departureAirportId: integer("departure_airport_id").notNull(),
  arrivalAirportId: integer("arrival_airport_id").notNull(),
  departureTime: timestamp("departure_time").notNull(),
  arrivalTime: timestamp("arrival_time").notNull(),
  price: decimal("price").notNull(),
  airline: text("airline").notNull(),
  flightNumber: text("flight_number").notNull(),
});

export const bookings = pgTable("bookings", {
  id: serial("id").primaryKey(),
  flightId: integer("flight_id").notNull(),
  passengerName: text("passenger_name").notNull(),
  passengerEmail: text("passenger_email").notNull(),
  bookingReference: text("booking_reference").notNull(),
});

export const insertFlightSchema = createInsertSchema(flights);
export const insertBookingSchema = createInsertSchema(bookings).omit({ id: true });

export type Airport = typeof airports.$inferSelect;
export type Flight = typeof flights.$inferSelect;
export type Booking = typeof bookings.$inferSelect;
export type InsertBooking = z.infer<typeof insertBookingSchema>;

export const searchFlightsSchema = z.object({
  departureAirportId: z.number(),
  startDate: z.string(),
  endDate: z.string(),
  maxPrice: z.number().optional(),
});

export type SearchFlightsParams = z.infer<typeof searchFlightsSchema>;
