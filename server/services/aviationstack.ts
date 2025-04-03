// Servizio per l'integrazione con AviationStack API
import axios from 'axios';
import { Flight } from '@shared/schema';

const BASE_URL = 'http://api.aviationstack.com/v1';

interface AviationStackFlight {
  flight_date: string;
  flight_status: string;
  departure: {
    airport: string;
    timezone: string;
    iata: string;
    icao: string;
    terminal: string;
    gate: string;
    delay: number;
    scheduled: string;
    estimated: string;
    actual: string;
    estimated_runway: string;
    actual_runway: string;
  };
  arrival: {
    airport: string;
    timezone: string;
    iata: string;
    icao: string;
    terminal: string;
    gate: string;
    baggage: string;
    delay: number;
    scheduled: string;
    estimated: string;
    actual: string;
    estimated_runway: string;
    actual_runway: string;
  };
  airline: {
    name: string;
    iata: string;
    icao: string;
  };
  flight: {
    number: string;
    iata: string;
    icao: string;
  };
  aircraft: {
    registration: string;
    iata: string;
    icao: string;
    icao24: string;
  };
  live: {
    updated: string;
    latitude: number;
    longitude: number;
    altitude: number;
    direction: number;
    speed_horizontal: number;
    speed_vertical: number;
    is_ground: boolean;
  };
}

/**
 * Cerca voli in base ai parametri specificati utilizzando AviationStack API
 */
export async function searchFlights(params: {
  departureIata: string;
  arrivalIata?: string;
  date: string;
}): Promise<any[]> {
  try {
    console.log('Ricerca voli con AviationStack:', params);
    
    const queryParams = new URLSearchParams({
      access_key: process.env.AVIATIONSTACK_API_KEY as string,
      dep_iata: params.departureIata,
      limit: '100',
    });
    
    if (params.arrivalIata) {
      queryParams.append('arr_iata', params.arrivalIata);
    }
    
    // Imposta la data nel formato adatto (YYYY-MM-DD)
    const flightDate = new Date(params.date).toISOString().split('T')[0];
    queryParams.append('flight_date', flightDate);
    
    const url = `${BASE_URL}/flights?${queryParams.toString()}`;
    console.log('URL richiesta AviationStack:', url);
    
    const response = await axios.get(url);
    
    if (response.data.error) {
      console.error('Errore AviationStack:', response.data.error);
      return [];
    }
    
    console.log(`Trovati ${response.data.data?.length || 0} voli`);
    return response.data.data || [];
    
  } catch (error) {
    console.error('Errore durante la ricerca dei voli con AviationStack:', error);
    return [];
  }
}

/**
 * Converti un volo AviationStack nel formato Flight del nostro sistema
 */
export function convertToAppFlight(
  aviationStackFlight: AviationStackFlight, 
  departureAirportId: number, 
  arrivalAirportId: number,
  id: number
): Flight {
  const price = (Math.floor(Math.random() * 201) + 50).toFixed(2); // Prezzo casuale tra 50 e 250 euro
  
  return {
    id,
    departureAirportId,
    arrivalAirportId,
    departureTime: new Date(aviationStackFlight.departure.scheduled || aviationStackFlight.flight_date),
    arrivalTime: new Date(aviationStackFlight.arrival.scheduled || aviationStackFlight.flight_date),
    price,
    airline: aviationStackFlight.airline.name || 'Compagnia Aerea',
    flightNumber: aviationStackFlight.flight.iata || `${aviationStackFlight.airline.iata}${aviationStackFlight.flight.number}`,
  };
}