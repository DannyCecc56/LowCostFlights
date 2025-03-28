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
      
      try {
        const flights = await storage.searchFlights(validatedParams);
        console.log("Voli trovati:", flights?.length || 0);
        
        if (!flights || flights.length === 0) {
          return res.status(404).json({ 
            error: "Nessun volo trovato",
            details: "Non sono stati trovati voli per i criteri di ricerca specificati"
          });
        }
        
        res.json(flights);
      } catch (searchError) {
        console.error("Errore nella ricerca dei voli:", searchError);
        res.status(500).json({ 
          error: "Errore durante la ricerca dei voli",
          details: searchError instanceof Error ? searchError.message : 'Errore nel servizio di ricerca voli'
        });
      }
    } catch (validationError) {
      console.error("Errore nella validazione dei parametri:", validationError);
      res.status(400).json({ 
        error: "Parametri di ricerca non validi",
        details: validationError instanceof Error ? validationError.message : 'Errore di validazione'
      });
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
