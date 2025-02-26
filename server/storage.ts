import { Airport, Flight, Booking, InsertBooking, SearchFlightsParams } from "@shared/schema";
import { nanoid } from "nanoid";
import { searchFlights, getAirports as getAmadeusAirports } from "./services/amadeus";

export interface IStorage {
  getAirports(): Promise<Airport[]>;
  searchFlights(params: SearchFlightsParams): Promise<Flight[]>;
  getFlight(id: number): Promise<Flight | undefined>;
  createBooking(booking: InsertBooking): Promise<Booking>;
}

export class MemStorage implements IStorage {
  private airports: Map<number, Airport>;
  private bookings: Map<number, Booking>;
  private currentId: number;

  constructor() {
    this.airports = new Map();
    this.bookings = new Map();
    this.currentId = 1;
    this.initializeAirports();
  }

  private async initializeAirports() {
    try {
      // Inizializza con i principali aeroporti italiani
      const cities = ["Roma", "Milano", "Venezia", "Napoli", "Catania"];
      for (const city of cities) {
        const amadeusAirports = await getAmadeusAirports(city);
        if (amadeusAirports.length > 0) {
          const airport = amadeusAirports[0];
          this.airports.set(this.currentId, {
            id: this.currentId++,
            code: airport.iataCode,
            name: airport.name,
            city: airport.address.cityName
          });
        }
      }
    } catch (error) {
      console.error('Errore nell\'inizializzazione degli aeroporti:', error);
    }
  }

  async getAirports(): Promise<Airport[]> {
    return Array.from(this.airports.values());
  }

  async searchFlights(params: SearchFlightsParams): Promise<Flight[]> {
    const departureAirport = Array.from(this.airports.values()).find(
      airport => airport.id === params.departureAirportId
    );

    if (!departureAirport) {
      throw new Error("Aeroporto di partenza non valido");
    }

    try {
      const amadeusFlights = await searchFlights({
        originLocationCode: departureAirport.code,
        destinationLocationCode: "", // Cerchiamo voli per tutte le destinazioni
        departureDate: new Date(params.startDate).toISOString().split('T')[0],
        adults: 1,
        max: 20
      });

      return amadeusFlights.map((offer, index) => {
        const segment = offer.itineraries[0].segments[0];
        return {
          id: index + 1,
          departureAirportId: params.departureAirportId,
          arrivalAirportId: 0, // Sarà gestito dal frontend
          departureTime: new Date(segment.departure.at),
          arrivalTime: new Date(segment.arrival.at),
          price: parseFloat(offer.price.total),
          airline: segment.carrierCode,
          flightNumber: `${segment.carrierCode}${segment.number}`
        };
      });
    } catch (error) {
      console.error('Errore nella ricerca dei voli:', error);
      return [];
    }
  }

  async getFlight(id: number): Promise<Flight | undefined> {
    // Implementazione da aggiornare con dati reali
    return undefined;
  }

  async createBooking(booking: InsertBooking): Promise<Booking> {
    const id = this.currentId++;
    const newBooking: Booking = {
      ...booking,
      id,
      bookingReference: nanoid(8).toUpperCase()
    };
    this.bookings.set(id, newBooking);
    return newBooking;
  }
}

export const storage = new MemStorage();