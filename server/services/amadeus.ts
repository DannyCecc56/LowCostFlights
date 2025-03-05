import Amadeus from 'amadeus';

const amadeus = new Amadeus({
  clientId: process.env.AMADEUS_CLIENT_ID || 'dummy-id',
  clientSecret: process.env.AMADEUS_CLIENT_SECRET || 'dummy-secret'
});

// Utilizzeremo dati di esempio per evitare chiamate API eccessive
const MOCK_MODE = true;

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

// Dati di esempio per i voli
const MOCK_FLIGHT_OFFERS = [
  {
    id: "1",
    source: "GDS",
    instantTicketingRequired: false,
    nonHomogeneous: false,
    oneWay: false,
    lastTicketingDate: "2023-12-31",
    numberOfBookableSeats: 9,
    itineraries: [
      {
        duration: "PT2H",
        segments: [
          {
            departure: {
              iataCode: "FCO",
              terminal: "1",
              at: "2023-12-20T10:00:00"
            },
            arrival: {
              iataCode: "MXP",
              terminal: "2",
              at: "2023-12-20T12:00:00"
            },
            carrierCode: "AZ",
            number: "1234",
            aircraft: {
              code: "321"
            },
            operating: {
              carrierCode: "AZ"
            },
            duration: "PT2H",
            id: "1",
            numberOfStops: 0,
            blacklistedInEU: false
          }
        ]
      }
    ],
    price: {
      currency: "EUR",
      total: "59.99",
      base: "49.99",
      fees: [
        {
          amount: "10.00",
          type: "SUPPLIER"
        }
      ],
      grandTotal: "59.99"
    },
    pricingOptions: {
      fareType: ["PUBLISHED"],
      includedCheckedBagsOnly: false
    },
    validatingAirlineCodes: ["AZ"],
    travelerPricings: [
      {
        travelerId: "1",
        fareOption: "STANDARD",
        travelerType: "ADULT",
        price: {
          currency: "EUR",
          total: "59.99",
          base: "49.99"
        }
      }
    ]
  },
  {
    id: "2",
    source: "GDS",
    instantTicketingRequired: false,
    nonHomogeneous: false,
    oneWay: false,
    lastTicketingDate: "2023-12-31",
    numberOfBookableSeats: 5,
    itineraries: [
      {
        duration: "PT1H30M",
        segments: [
          {
            departure: {
              iataCode: "MXP",
              terminal: "2",
              at: "2023-12-21T08:00:00"
            },
            arrival: {
              iataCode: "NAP",
              terminal: "1",
              at: "2023-12-21T09:30:00"
            },
            carrierCode: "FR",
            number: "5678",
            aircraft: {
              code: "738"
            },
            operating: {
              carrierCode: "FR"
            },
            duration: "PT1H30M",
            id: "2",
            numberOfStops: 0,
            blacklistedInEU: false
          }
        ]
      }
    ],
    price: {
      currency: "EUR",
      total: "39.99",
      base: "29.99",
      fees: [
        {
          amount: "10.00",
          type: "SUPPLIER"
        }
      ],
      grandTotal: "39.99"
    },
    pricingOptions: {
      fareType: ["PUBLISHED"],
      includedCheckedBagsOnly: false
    },
    validatingAirlineCodes: ["FR"],
    travelerPricings: [
      {
        travelerId: "1",
        fareOption: "STANDARD",
        travelerType: "ADULT",
        price: {
          currency: "EUR",
          total: "39.99",
          base: "29.99"
        }
      }
    ]
  }
];

export async function searchFlights(params: {
  originLocationCode: string;
  destinationLocationCode: string;
  departureDate: string;
  adults: number;
  max?: number;
}): Promise<FlightOffer[]> {
  if (MOCK_MODE) {
    console.log('Utilizzando dati di esempio per i voli');
    // Simuliamo un breve ritardo per emulare la risposta dell'API
    await delay(500);
    return MOCK_FLIGHT_OFFERS;
  }
  
  try {
    const response = await amadeus.shopping.flightOffersSearch.get({
      ...params,
      currencyCode: 'EUR',
      nonStop: true
    });

    return response.data;
  } catch (error) {
    console.error('Errore nella ricerca dei voli:', error);
    return MOCK_FLIGHT_OFFERS; // In caso di errore, restituisci dati di esempio
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

// Dati di esempio per aeroporti italiani
const MOCK_AIRPORTS = [
  {
    iataCode: "FCO",
    name: "Rome Fiumicino Airport",
    address: {
      cityName: "Roma",
      countryCode: "IT"
    }
  },
  {
    iataCode: "MXP",
    name: "Milan Malpensa Airport",
    address: {
      cityName: "Milano",
      countryCode: "IT"
    }
  },
  {
    iataCode: "VCE",
    name: "Venice Marco Polo Airport",
    address: {
      cityName: "Venezia",
      countryCode: "IT"
    }
  },
  {
    iataCode: "NAP",
    name: "Naples International Airport",
    address: {
      cityName: "Napoli",
      countryCode: "IT"
    }
  }
];

export async function getAirports(): Promise<any[]> {
  if (MOCK_MODE) {
    console.log('Utilizzando dati di esempio per gli aeroporti');
    return MOCK_AIRPORTS;
  }
  
  try {
    const allAirports = [];
    const processedCodes = new Set(); // Per evitare duplicati
    
    // Riduciamo drasticamente il numero di aeroporti per evitare limiti API
    const limitedAirports = ITALIAN_AIRPORTS.slice(0, 1); // Prendiamo solo un aeroporto

    for (const city of limitedAirports) {
      try {
        // Aggiungiamo un ritardo di 2 secondi tra le richieste
        await delay(2000);
        
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

    return allAirports.length > 0 ? allAirports : MOCK_AIRPORTS;
  } catch (error) {
    console.error('Errore nel recupero degli aeroporti:', error);
    return MOCK_AIRPORTS; // In caso di errore usa i dati di esempio
  }
}