import { pgTable, text, serial, integer, timestamp, numeric } from "drizzle-orm/pg-core";
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
  price: numeric("price", { precision: 10, scale: 2 }).notNull(),
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
  departureDate: z.string(),
  returnDate: z.string().optional(),
  maxPrice: z.number().optional(),
});

export type SearchFlightsParams = z.infer<typeof searchFlightsSchema>;
import { z } from 'zod';

// Schema per aeroporti
export const airportSchema = z.object({
  id: z.number(),
  name: z.string(),
  code: z.string(),
  city: z.string(),
  country: z.string(),
  countryCode: z.string()
});

export type Airport = z.infer<typeof airportSchema>;

// Schema per voli
export const flightSchema = z.object({
  id: z.number(),
  departureAirport: z.string(),
  departureAirportCode: z.string(),
  arrivalAirport: z.string(),
  arrivalAirportCode: z.string(),
  departureDateTime: z.string(),
  arrivalDateTime: z.string(),
  price: z.number(),
  airline: z.string(),
  flightNumber: z.string()
});

export type Flight = z.infer<typeof flightSchema>;

// Schema per parametri di ricerca voli
export const searchFlightsSchema = z.object({
  departureAirportId: z.number(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  maxPrice: z.number().optional()
});

export type SearchFlightsParams = z.infer<typeof searchFlightsSchema>;

// Schema per prenotazioni
export const insertBookingSchema = z.object({
  flightId: z.number(),
  passengerName: z.string(),
  passengerSurname: z.string(),
  passengerEmail: z.string().email(),
  passengerPhone: z.string().optional()
});

export type InsertBooking = z.infer<typeof insertBookingSchema>;

export const bookingSchema = insertBookingSchema.extend({
  id: z.number(),
  bookingReference: z.string()
});

export type Booking = z.infer<typeof bookingSchema>;
