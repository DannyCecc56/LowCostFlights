import type { Express } from "express";
import { createServer } from "http";
import { storage } from "./storage";
import { searchFlightsSchema, insertBookingSchema } from "@shared/schema";

export async function registerRoutes(app: Express) {
  const httpServer = createServer(app);

  app.get("/api/airports", async (_req, res) => {
    const airports = await storage.getAirports();
    res.json(airports);
  });

  app.get("/api/flights/search", async (req, res) => {
    try {
      const params = searchFlightsSchema.parse({
        departureAirportId: parseInt(req.query.departureAirportId as string),
        startDate: req.query.startDate,
        endDate: req.query.endDate,
        maxPrice: req.query.maxPrice ? parseInt(req.query.maxPrice as string) : undefined
      });

      const flights = await storage.searchFlights(params);
      res.json(flights);
    } catch (error) {
      res.status(400).json({ error: "Parametri di ricerca non validi" });
    }
  });

  app.get("/api/flights/:id", async (req, res) => {
    const flight = await storage.getFlight(parseInt(req.params.id));
    if (!flight) {
      res.status(404).json({ error: "Volo non trovato" });
      return;
    }
    res.json(flight);
  });

  app.post("/api/bookings", async (req, res) => {
    try {
      const bookingData = insertBookingSchema.parse(req.body);
      const booking = await storage.createBooking(bookingData);
      res.status(201).json(booking);
    } catch (error) {
      res.status(400).json({ error: "Dati prenotazione non validi" });
    }
  });

  return httpServer;
}
