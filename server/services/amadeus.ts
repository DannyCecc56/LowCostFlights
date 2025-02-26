import Amadeus from 'amadeus';

const amadeus = new Amadeus({
  clientId: process.env.AMADEUS_CLIENT_ID,
  clientSecret: process.env.AMADEUS_CLIENT_SECRET
});

export interface FlightOffer {
  id: string;
  source: string;
  instantTicketingRequired: boolean;
  nonHomogeneous: boolean;
  oneWay: boolean;
  lastTicketingDate: string;
  numberOfBookableSeats: number;
  itineraries: Array<{
    duration: string;
    segments: Array<{
      departure: {
        iataCode: string;
        terminal?: string;
        at: string;
      };
      arrival: {
        iataCode: string;
        terminal?: string;
        at: string;
      };
      carrierCode: string;
      number: string;
      aircraft: {
        code: string;
      };
      operating: {
        carrierCode: string;
      };
      duration: string;
      id: string;
      numberOfStops: number;
      blacklistedInEU: boolean;
    }>;
  }>;
  price: {
    currency: string;
    total: string;
    base: string;
    fees: Array<{
      amount: string;
      type: string;
    }>;
    grandTotal: string;
  };
  pricingOptions: {
    fareType: string[];
    includedCheckedBagsOnly: boolean;
  };
  validatingAirlineCodes: string[];
  travelerPricings: Array<{
    travelerId: string;
    fareOption: string;
    travelerType: string;
    price: {
      currency: string;
      total: string;
      base: string;
    };
  }>;
}

export async function searchFlights(params: {
  originLocationCode: string;
  destinationLocationCode: string;
  departureDate: string;
  adults: number;
  max?: number;
}): Promise<FlightOffer[]> {
  try {
    const response = await amadeus.shopping.flightOffersSearch.get({
      ...params,
      currencyCode: 'EUR',
      nonStop: true
    });

    return response.data;
  } catch (error) {
    console.error('Errore nella ricerca dei voli:', error);
    throw new Error('Impossibile recuperare i voli in questo momento');
  }
}

// Lista degli aeroporti italiani principali
const ITALIAN_AIRPORTS = [
  "Roma", "Milano", "Venezia", "Napoli", "Catania", "Palermo", 
  "Bologna", "Torino", "Bari", "Cagliari", "Pisa", "Verona",
  "Firenze", "Genova", "Trieste", "Lamezia Terme", "Alghero",
  "Brindisi", "Pescara", "Ancona"
];

export async function getAirports(): Promise<any[]> {
  try {
    const allAirports = [];

    for (const city of ITALIAN_AIRPORTS) {
      try {
        const response = await amadeus.referenceData.locations.get({
          keyword: city,
          subType: "AIRPORT",
          countryCode: 'IT'
        });

        if (response.data && response.data.length > 0) {
          allAirports.push(...response.data);
        }
      } catch (error) {
        console.error(`Errore nel recupero dell'aeroporto di ${city}:`, error);
      }
    }

    return allAirports;
  } catch (error) {
    console.error('Errore nel recupero degli aeroporti:', error);
    throw new Error('Impossibile recuperare la lista degli aeroporti');
  }
}