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

// Lista completa degli aeroporti italiani
const ITALIAN_AIRPORTS = [
  // Aeroporti principali
  "Roma Fiumicino", "Roma Ciampino",
  "Milano Malpensa", "Milano Linate", "Milano Bergamo",
  "Venezia Marco Polo", "Treviso",
  "Napoli Capodichino",
  "Catania Fontanarossa",
  "Palermo Falcone Borsellino",
  "Bologna Guglielmo Marconi",
  "Torino Caselle",
  "Bari Karol Wojtyla",
  "Cagliari Elmas",
  "Pisa Galileo Galilei",
  "Verona Villafranca",

  // Aeroporti secondari ma importanti
  "Firenze Peretola",
  "Genova Cristoforo Colombo",
  "Trieste Ronchi dei Legionari",
  "Lamezia Terme",
  "Alghero Fertilia",
  "Brindisi Papola Casale",
  "Pescara Abruzzo",
  "Ancona Falconara",
  "Olbia Costa Smeralda",
  "Rimini Federico Fellini",
  "Trapani Birgi",
  "Comiso",
  "Lampedusa",
  "Pantelleria",
  "Reggio Calabria",
  "Crotone",
  "Cuneo Levaldigi",
  "Parma",
  "Perugia San Francesco",
  "Brescia Montichiari"
];

export async function getAirports(): Promise<any[]> {
  try {
    const allAirports = [];
    const processedCodes = new Set(); // Per evitare duplicati

    for (const city of ITALIAN_AIRPORTS) {
      try {
        const response = await amadeus.referenceData.locations.get({
          keyword: city,
          subType: "AIRPORT",
          countryCode: 'IT'
        });

        if (response.data && response.data.length > 0) {
          // Filtra per evitare duplicati e aggiungi solo aeroporti italiani
          const uniqueAirports = response.data.filter(airport => {
            if (airport.address.countryCode === 'IT' && !processedCodes.has(airport.iataCode)) {
              processedCodes.add(airport.iataCode);
              return true;
            }
            return false;
          });

          allAirports.push(...uniqueAirports);
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