import { Airport, Flight, Booking, InsertBooking, SearchFlightsParams } from "@shared/schema";
import { nanoid } from "nanoid";
import { searchFlights as searchAmadeusFlights, getAirports as getAmadeusAirports } from "./services/amadeus";
import { searchFlights as searchAviationStackFlights, convertToAppFlight } from "./services/aviationstack";

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
      const amadeusAirports = await getAmadeusAirports();
      for (const airport of amadeusAirports) {
        this.airports.set(this.currentId, {
          id: this.currentId++,
          code: airport.iataCode,
          name: airport.name,
          city: airport.address.cityName
        });
      }
    } catch (error) {
      console.error('Errore nell\'inizializzazione degli aeroporti:', error);
    }
  }

  async getAirports(): Promise<Airport[]> {
    return Array.from(this.airports.values());
  }

  private getAirportIdByCode(code: string): number {
    const airport = Array.from(this.airports.values()).find(a => a.code === code);
    return airport ? airport.id : 0;
  }

  async searchFlights(params: SearchFlightsParams): Promise<Flight[]> {
    try {
      console.log("Ricerca voli con parametri:", params);
      if (!params.departureDate) {
        throw new Error("Data di partenza mancante");
      }

      const departureAirport = Array.from(this.airports.values()).find(
        airport => airport.id === params.departureAirportId
      );

      if (!departureAirport) {
        throw new Error("Aeroporto di partenza non valido");
      }

      // Genera voli di esempio per più giorni
      const mockFlights: Flight[] = [];
      const basePrice = 150;
      const daysToGenerate = 3; // Genera voli per 3 giorni

      for (let day = 0; day < daysToGenerate; day++) {
        for (let i = 0; i < 5; i++) {
          const departureTime = new Date(params.departureDate);
          departureTime.setDate(departureTime.getDate() + day);
          departureTime.setHours(8 + i * 3);

          const arrivalTime = new Date(departureTime);
          arrivalTime.setHours(arrivalTime.getHours() + 2);

          const randomPrice = basePrice + (i * 25) + (Math.random() * 50);
          
          mockFlights.push({
            id: day * 5 + i + 1,
            departureAirportId: params.departureAirportId,
            arrivalAirportId: 2,
            departureTime,
            arrivalTime,
            price: Math.round(randomPrice).toString(),
            airline: "ITA Airways",
            flightNumber: `IT${1000 + day * 100 + i}`
          });
        }
      }

      return mockFlights;
    } catch (error) {
      console.error('Errore nella ricerca dei voli:', error);
      return [];
    }
  }

  async getFlight(id: number): Promise<Flight | undefined> {
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