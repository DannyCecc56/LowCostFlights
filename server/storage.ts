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

  async searchFlights(params: SearchFlightsParams): Promise<Flight[]> {
    const departureAirport = Array.from(this.airports.values()).find(
      airport => airport.id === params.departureAirportId
    );

    if (!departureAirport) {
      throw new Error("Aeroporto di partenza non valido");
    }

    try {
      const searchPromises = [
        // Ricerca voli di andata
        searchFlights({
          originLocationCode: departureAirport.code,
          destinationLocationCode: "", // Cerchiamo voli per tutte le destinazioni
          departureDate: new Date(params.departureDate).toISOString().split('T')[0],
          adults: 1,
          max: 20
        })
      ];

      // Se è specificata una data di ritorno, aggiungi la ricerca dei voli di ritorno
      if (params.returnDate) {
        searchPromises.push(
          searchFlights({
            originLocationCode: "", // Cerchiamo da tutte le origini
            destinationLocationCode: departureAirport.code, // Verso l'aeroporto di partenza originale
            departureDate: new Date(params.returnDate).toISOString().split('T')[0],
            adults: 1,
            max: 20
          })
        );
      }

      const [departureFlights, ...returnFlights] = await Promise.all(searchPromises);

      // Converti i risultati nel formato Flight
      const flights = departureFlights.map((offer, index) => {
        const segment = offer.itineraries[0].segments[0];
        return {
          id: index + 1,
          departureAirportId: params.departureAirportId,
          arrivalAirportId: this.getAirportIdByCode(segment.arrival.iataCode),
          departureTime: new Date(segment.departure.at),
          arrivalTime: new Date(segment.arrival.at),
          price: parseFloat(offer.price.total),
          airline: segment.carrierCode,
          flightNumber: `${segment.carrierCode}${segment.number}`
        };
      });

      // Aggiungi i voli di ritorno se presenti
      if (returnFlights.length > 0) {
        const returnFlightResults = returnFlights[0].map((offer, index) => {
          const segment = offer.itineraries[0].segments[0];
          return {
            id: flights.length + index + 1,
            departureAirportId: this.getAirportIdByCode(segment.departure.iataCode),
            arrivalAirportId: params.departureAirportId,
            departureTime: new Date(segment.departure.at),
            arrivalTime: new Date(segment.arrival.at),
            price: parseFloat(offer.price.total),
            airline: segment.carrierCode,
            flightNumber: `${segment.carrierCode}${segment.number}`
          };
        });
        flights.push(...returnFlightResults);
      }

      return flights;
    } catch (error) {
      console.error('Errore nella ricerca dei voli:', error);
      return [];
    }
  }

  private getAirportIdByCode(code: string): number {
    const airport = Array.from(this.airports.values()).find(a => a.code === code);
    return airport ? airport.id : 0;
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
import { nanoid } from 'nanoid';
import { getAirports, searchFlights } from './services/amadeus';
import { InsertBooking, Booking, Airport, Flight, SearchFlightsParams } from '@shared/schema';

class MemStorage {
  private airports = new Map<number, Airport>();
  private flights = new Map<number, Flight>();
  private bookings = new Map<number, Booking>();
  private currentId = 1;
  private airportsLoaded = false;

  async getAirports(): Promise<Airport[]> {
    try {
      if (!this.airportsLoaded) {
        const amadeusAirports = await getAirports();
        
        // Trasforma i dati Amadeus in formato Airport
        amadeusAirports.forEach((airport: any, index: number) => {
          const airportData: Airport = {
            id: index + 1,
            name: airport.name,
            code: airport.iataCode,
            city: airport.address.cityName,
            country: airport.address.countryName,
            countryCode: airport.address.countryCode
          };
          this.airports.set(airportData.id, airportData);
        });
        
        this.airportsLoaded = true;
      }
      
      return Array.from(this.airports.values());
    } catch (error) {
      console.error('Errore nel recupero degli aeroporti:', error);
      return [];
    }
  }

  async searchFlights(params: SearchFlightsParams): Promise<Flight[]> {
    try {
      const searchResults = await searchFlights(params);
      
      // Trasforma i risultati nel formato Flight
      const flights: Flight[] = searchResults.map((flight: any) => {
        return {
          id: flight.id,
          departureAirport: flight.departureAirport,
          departureAirportCode: flight.departureIataCode,
          arrivalAirport: flight.arrivalAirport,
          arrivalAirportCode: flight.arrivalIataCode,
          departureDateTime: flight.departureDate,
          arrivalDateTime: flight.arrivalDate,
          price: flight.price,
          airline: flight.airline,
          flightNumber: flight.flightNumber
        };
      });
      
      return flights;
    } catch (error) {
      console.error('Errore nella ricerca dei voli:', error);
      return [];
    }
  }

  async getFlight(id: number): Promise<Flight | undefined> {
    // Simuliamo un volo di esempio
    if (id > 0) {
      return {
        id: id,
        departureAirport: "ROMA FIUMICINO",
        departureAirportCode: "FCO",
        arrivalAirport: "MILANO MALPENSA",
        arrivalAirportCode: "MXP",
        departureDateTime: "2023-12-01T08:30:00",
        arrivalDateTime: "2023-12-01T09:45:00",
        price: 89.99,
        airline: "Alitalia",
        flightNumber: "AZ1234"
      };
    }
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
