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

// Funzione per aggiungere un ritardo
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function getAirports(): Promise<any[]> {
  // Usiamo dati di test invece di fare chiamate API
  // Questo evita i limiti delle API Amadeus
  const mockAirports = [
    {
      "type": "location",
      "subType": "AIRPORT",
      "name": "ROMA FIUMICINO",
      "detailedName": "ROMA FIUMICINO, IT",
      "id": "AFCO",
      "self": {
        "href": "https://test.api.amadeus.com/v1/reference-data/locations/AFCO",
        "methods": ["GET"]
      },
      "timeZoneOffset": "+02:00",
      "iataCode": "FCO",
      "geoCode": {
        "latitude": 41.8003,
        "longitude": 12.2389
      },
      "address": {
        "cityName": "ROMA",
        "cityCode": "ROM",
        "countryName": "ITALY",
        "countryCode": "IT",
        "regionCode": "EUR"
      },
      "analytics": {
        "travelers": {
          "score": 33
        }
      }
    },
    {
      "type": "location",
      "subType": "AIRPORT",
      "name": "MILANO MALPENSA",
      "detailedName": "MILANO MALPENSA, IT",
      "id": "AMIL",
      "self": {
        "href": "https://test.api.amadeus.com/v1/reference-data/locations/AMIL",
        "methods": ["GET"]
      },
      "timeZoneOffset": "+02:00",
      "iataCode": "MXP",
      "geoCode": {
        "latitude": 45.6306,
        "longitude": 8.7278
      },
      "address": {
        "cityName": "MILANO",
        "cityCode": "MIL",
        "countryName": "ITALY",
        "countryCode": "IT",
        "regionCode": "EUR"
      },
      "analytics": {
        "travelers": {
          "score": 29
        }
      }
    },
    {
      "type": "location",
      "subType": "AIRPORT",
      "name": "VENEZIA MARCO POLO",
      "detailedName": "VENEZIA MARCO POLO, IT",
      "id": "AVEC",
      "self": {
        "href": "https://test.api.amadeus.com/v1/reference-data/locations/AVEC",
        "methods": ["GET"]
      },
      "timeZoneOffset": "+02:00",
      "iataCode": "VCE",
      "geoCode": {
        "latitude": 45.5053,
        "longitude": 12.3519
      },
      "address": {
        "cityName": "VENEZIA",
        "cityCode": "VCE",
        "countryName": "ITALY",
        "countryCode": "IT",
        "regionCode": "EUR"
      },
      "analytics": {
        "travelers": {
          "score": 25
        }
      }
    }
  ];

  return mockAirports;
}
import Amadeus from 'amadeus';

// Normalmente si creerebbe un'istanza Amadeus, ma useremo dati di test
/* 
const amadeus = new Amadeus({
  clientId: process.env.AMADEUS_CLIENT_ID,
  clientSecret: process.env.AMADEUS_CLIENT_SECRET
});
*/

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function getAirports(): Promise<any[]> {
  // Dati di test per aeroporti italiani
  const mockAirports = [
    {
      "type": "location",
      "subType": "AIRPORT",
      "name": "ROMA FIUMICINO",
      "detailedName": "ROMA FIUMICINO, IT",
      "id": "AFCO",
      "self": {
        "href": "https://test.api.amadeus.com/v1/reference-data/locations/AFCO",
        "methods": ["GET"]
      },
      "timeZoneOffset": "+02:00",
      "iataCode": "FCO",
      "geoCode": {
        "latitude": 41.8003,
        "longitude": 12.2389
      },
      "address": {
        "cityName": "ROMA",
        "cityCode": "ROM",
        "countryName": "ITALY",
        "countryCode": "IT",
        "regionCode": "EUR"
      },
      "analytics": {
        "travelers": {
          "score": 33
        }
      }
    },
    {
      "type": "location",
      "subType": "AIRPORT",
      "name": "MILANO MALPENSA",
      "detailedName": "MILANO MALPENSA, IT",
      "id": "AMIL",
      "self": {
        "href": "https://test.api.amadeus.com/v1/reference-data/locations/AMIL",
        "methods": ["GET"]
      },
      "timeZoneOffset": "+02:00",
      "iataCode": "MXP",
      "geoCode": {
        "latitude": 45.6306,
        "longitude": 8.7278
      },
      "address": {
        "cityName": "MILANO",
        "cityCode": "MIL",
        "countryName": "ITALY",
        "countryCode": "IT",
        "regionCode": "EUR"
      },
      "analytics": {
        "travelers": {
          "score": 29
        }
      }
    },
    {
      "type": "location",
      "subType": "AIRPORT",
      "name": "VENEZIA MARCO POLO",
      "detailedName": "VENEZIA MARCO POLO, IT",
      "id": "AVEC",
      "self": {
        "href": "https://test.api.amadeus.com/v1/reference-data/locations/AVEC",
        "methods": ["GET"]
      },
      "timeZoneOffset": "+02:00",
      "iataCode": "VCE",
      "geoCode": {
        "latitude": 45.5053,
        "longitude": 12.3519
      },
      "address": {
        "cityName": "VENEZIA",
        "cityCode": "VCE",
        "countryName": "ITALY",
        "countryCode": "IT",
        "regionCode": "EUR"
      },
      "analytics": {
        "travelers": {
          "score": 25
        }
      }
    },
    {
      "type": "location",
      "subType": "AIRPORT",
      "name": "NAPOLI CAPODICHINO",
      "detailedName": "NAPOLI CAPODICHINO, IT",
      "id": "ANAP",
      "self": {
        "href": "https://test.api.amadeus.com/v1/reference-data/locations/ANAP",
        "methods": ["GET"]
      },
      "timeZoneOffset": "+02:00",
      "iataCode": "NAP",
      "geoCode": {
        "latitude": 40.8839,
        "longitude": 14.2908
      },
      "address": {
        "cityName": "NAPOLI",
        "cityCode": "NAP",
        "countryName": "ITALY",
        "countryCode": "IT",
        "regionCode": "EUR"
      },
      "analytics": {
        "travelers": {
          "score": 22
        }
      }
    }
  ];

  return mockAirports;
}

export async function searchFlights(options: any): Promise<any[]> {
  // Dati di test per voli
  const mockFlights = [
    {
      id: 1,
      departureAirport: "ROMA FIUMICINO",
      departureIataCode: "FCO",
      arrivalAirport: "MILANO MALPENSA",
      arrivalIataCode: "MXP",
      departureDate: "2023-12-01T08:30:00",
      arrivalDate: "2023-12-01T09:45:00",
      price: 89.99,
      airline: "Alitalia",
      flightNumber: "AZ1234"
    },
    {
      id: 2,
      departureAirport: "ROMA FIUMICINO",
      departureIataCode: "FCO",
      arrivalAirport: "VENEZIA MARCO POLO",
      arrivalIataCode: "VCE",
      departureDate: "2023-12-01T10:15:00",
      arrivalDate: "2023-12-01T11:30:00",
      price: 75.50,
      airline: "Ryanair",
      flightNumber: "FR5678"
    },
    {
      id: 3,
      departureAirport: "MILANO MALPENSA",
      departureIataCode: "MXP",
      arrivalAirport: "ROMA FIUMICINO",
      arrivalIataCode: "FCO",
      departureDate: "2023-12-05T16:00:00",
      arrivalDate: "2023-12-05T17:15:00",
      price: 92.30,
      airline: "EasyJet",
      flightNumber: "U23456"
    },
    {
      id: 4,
      departureAirport: "VENEZIA MARCO POLO",
      departureIataCode: "VCE",
      arrivalAirport: "NAPOLI CAPODICHINO",
      arrivalIataCode: "NAP",
      departureDate: "2023-12-02T07:45:00",
      arrivalDate: "2023-12-02T09:00:00",
      price: 68.75,
      airline: "Wizz Air",
      flightNumber: "W67890"
    }
  ];

  return mockFlights;
}
