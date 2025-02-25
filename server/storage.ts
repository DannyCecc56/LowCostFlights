import { Airport, Flight, Booking, InsertBooking, SearchFlightsParams } from "@shared/schema";
import { nanoid } from "nanoid";

export interface IStorage {
  getAirports(): Promise<Airport[]>;
  searchFlights(params: SearchFlightsParams): Promise<Flight[]>;
  getFlight(id: number): Promise<Flight | undefined>;
  createBooking(booking: InsertBooking): Promise<Booking>;
}

export class MemStorage implements IStorage {
  private airports: Map<number, Airport>;
  private flights: Map<number, Flight>;
  private bookings: Map<number, Booking>;
  private currentId: number;

  constructor() {
    this.airports = new Map();
    this.flights = new Map();
    this.bookings = new Map();
    this.currentId = 1;
    this.initializeData();
  }

  private initializeData() {
    const airports: Airport[] = [
      { id: 1, code: "FCO", name: "Aeroporto Leonardo da Vinci", city: "Roma" },
      { id: 2, code: "MXP", name: "Aeroporto di Milano-Malpensa", city: "Milano" },
      { id: 3, code: "VCE", name: "Aeroporto Marco Polo", city: "Venezia" },
      { id: 4, code: "NAP", name: "Aeroporto di Napoli", city: "Napoli" },
      { id: 5, code: "CTA", name: "Aeroporto di Catania", city: "Catania" }
    ];

    airports.forEach(airport => this.airports.set(airport.id, airport));

    // Generate mock flights
    const airlines = ["Alitalia", "Ryanair", "EasyJet", "Wizz Air"];
    const now = new Date();
    
    for (let i = 1; i <= 50; i++) {
      const depAirport = airports[Math.floor(Math.random() * airports.length)];
      let arrAirport;
      do {
        arrAirport = airports[Math.floor(Math.random() * airports.length)];
      } while (arrAirport.id === depAirport.id);

      const depTime = new Date(now.getTime() + Math.random() * 30 * 24 * 60 * 60 * 1000);
      const flight: Flight = {
        id: i,
        departureAirportId: depAirport.id,
        arrivalAirportId: arrAirport.id,
        departureTime: depTime,
        arrivalTime: new Date(depTime.getTime() + 2 * 60 * 60 * 1000),
        price: Math.floor(Math.random() * 200) + 50,
        airline: airlines[Math.floor(Math.random() * airlines.length)],
        flightNumber: `${airlines[0].substring(0, 2)}${Math.floor(Math.random() * 1000)}`
      };
      this.flights.set(flight.id, flight);
    }
  }

  async getAirports(): Promise<Airport[]> {
    return Array.from(this.airports.values());
  }

  async searchFlights(params: SearchFlightsParams): Promise<Flight[]> {
    const startDate = new Date(params.startDate);
    const endDate = new Date(params.endDate);

    return Array.from(this.flights.values()).filter(flight => {
      const matchesAirport = flight.departureAirportId === params.departureAirportId;
      const matchesDate = flight.departureTime >= startDate && flight.departureTime <= endDate;
      const matchesPrice = !params.maxPrice || flight.price <= params.maxPrice;
      return matchesAirport && matchesDate && matchesPrice;
    });
  }

  async getFlight(id: number): Promise<Flight | undefined> {
    return this.flights.get(id);
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
