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
      console.log("Query params ricevuti:", req.query);
      
      // Converti esplicitamente i parametri
      const departureAirportId = Number(req.query.departureAirportId);
      const params = {
        departureAirportId,
        departureDate: req.query.departureDate as string,
        returnDate: req.query.returnDate as string || undefined,
        maxPrice: req.query.maxPrice ? Number(req.query.maxPrice) : undefined
      };
      
      console.log("Parametri pre-validazione:", params);
      const validatedParams = searchFlightsSchema.parse(params);
      console.log("Parametri validati:", validatedParams);
      const flights = await storage.searchFlights(params);
      res.json(flights);
    } catch (error) {
      console.error("Errore nella validazione dei parametri:", error);
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
