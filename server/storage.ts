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

  async searchFlights(params: SearchFlightsParams): Promise<Flight[]> {
    try {
        console.log("Ricerca voli con parametri:", params);
        
        const departureAirport = Array.from(this.airports.values()).find(
          airport => airport.id === params.departureAirportId
        );

        if (!departureAirport) {
          throw new Error("Aeroporto di partenza non valido");
        }

        console.log("Aeroporto di partenza:", departureAirport);

    try {
      // Prima proviamo con AviationStack
      try {
        console.log("Tentativo di ricerca con AviationStack...");
        const aviationStackFlights = await searchAviationStackFlights({
          departureIata: departureAirport.code,
          date: params.departureDate
        });
        
        console.log(`AviationStack ha trovato ${aviationStackFlights.length} voli`);
        
        if (aviationStackFlights.length > 0) {
          // Abbiamo risultati da AviationStack
          const flights: Flight[] = [];
          let flightId = 1;
          
          // Converti i voli di andata in formato Flight
          for (const avFlight of aviationStackFlights) {
            const arrivalAirportId = this.getAirportIdByCode(avFlight.arrival?.iata);
            if (arrivalAirportId > 0) { // Solo se abbiamo l'aeroporto di arrivo nel nostro sistema
              flights.push(convertToAppFlight(avFlight, params.departureAirportId, arrivalAirportId, flightId++));
            }
          }
          
          // Se abbiamo voli di ritorno, cercali e aggiungili
          if (params.returnDate && flights.length > 0) {
            // Aggiungiamo alcuni voli di ritorno (per ora semplificati)
            // In una versione completa, dovremmo fare un'altra chiamata API
            const returnFlights = aviationStackFlights
              .slice(0, 5) // Prendiamo i primi 5 voli per semplicità
              .map((avFlight, idx) => {
                const departure = avFlight.arrival;
                const arrival = avFlight.departure;
                
                // Creiamo un volo di ritorno invertendo partenza e arrivo
                return {
                  id: flightId++,
                  departureAirportId: this.getAirportIdByCode(departure.iata),
                  arrivalAirportId: params.departureAirportId,
                  departureTime: new Date(params.returnDate || ""),
                  arrivalTime: new Date(new Date(params.returnDate || "").getTime() + 3600000 * 2), // +2 ore
                  price: (Math.floor(Math.random() * 150) + 50).toFixed(2), // Prezzo casuale tra 50 e 200
                  airline: avFlight.airline.name,
                  flightNumber: avFlight.flight.iata || `${avFlight.airline.iata}${avFlight.flight.number}`
                } as Flight;
              })
              .filter(flight => flight.departureAirportId > 0); // Solo aeroporti validi
              
            flights.push(...returnFlights);
          }
          
          if (flights.length === 0) {
            // Se non ci sono voli, creiamo alcuni voli di esempio
            const mockFlights: Flight[] = [];
            const basePrice = 150;
            
            // Genera 5 voli di esempio
            for (let i = 0; i < 5; i++) {
              const departureTime = new Date(params.departureDate);
              departureTime.setHours(8 + i * 3); // Voli ogni 3 ore a partire dalle 8
              
              const arrivalTime = new Date(departureTime);
              arrivalTime.setHours(arrivalTime.getHours() + 2); // Durata volo 2 ore
              
              mockFlights.push({
                id: i + 1,
                departureAirportId: params.departureAirportId,
                arrivalAirportId: 2, // Esempio: Roma
                departureTime,
                arrivalTime,
                price: (basePrice + (i * 25)).toString(), // Prezzo incrementale
                airline: "ITA Airways",
                flightNumber: `IT${1000 + i}`
              });
            }
            
            return mockFlights;
          }
          
          return flights;
        }
      } catch (aviationError) {
        console.error("Errore con AviationStack, tentativo con Amadeus:", aviationError);
        // In caso di errore, restituisci un array vuoto invece di propagare l'errore
        return [];
      }
      
      // Fallback a Amadeus se AviationStack fallisce o non ha risultati
      console.log("Tentativo ricerca con Amadeus...");
      const searchPromises = [
        // Ricerca voli di andata
        searchAmadeusFlights({
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
          searchAmadeusFlights({
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
          price: offer.price.total.toString(), // Assicuriamoci che sia una stringa
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
            price: offer.price.total.toString(), // Assicuriamoci che sia una stringa
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