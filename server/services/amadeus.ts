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

// Lista completa degli aeroporti italiani con codici IATA
const ITALIAN_AIRPORTS = [
  { name: "Roma Fiumicino", iataCode: "FCO" },
  { name: "Roma Ciampino", iataCode: "CIA" },
  { name: "Milano Malpensa", iataCode: "MXP" },
  { name: "Milano Linate", iataCode: "LIN" },
  { name: "Milano Bergamo", iataCode: "BGY" },
  { name: "Venezia Marco Polo", iataCode: "VCE" },
  { name: "Treviso", iataCode: "TSF" },
  { name: "Napoli Capodichino", iataCode: "NAP" },
  { name: "Catania Fontanarossa", iataCode: "CTA" },
  { name: "Palermo Falcone Borsellino", iataCode: "PMO" },
  { name: "Bologna Guglielmo Marconi", iataCode: "BLQ" },
  { name: "Torino Caselle", iataCode: "TRN" },
  { name: "Bari Karol Wojtyla", iataCode: "BRI" },
  { name: "Cagliari Elmas", iataCode: "CAG" },
  { name: "Pisa Galileo Galilei", iataCode: "PSA" },
  { name: "Verona Villafranca", iataCode: "VRN" },
  { name: "Firenze Peretola", iataCode: "FLR" },
  { name: "Genova Cristoforo Colombo", iataCode: "GOA" },
  { name: "Trieste Ronchi dei Legionari", iataCode: "TRS" },
  { name: "Lamezia Terme", iataCode: "SUF" },
  { name: "Alghero Fertilia", iataCode: "AHO" },
  { name: "Brindisi Papola Casale", iataCode: "BDS" },
  { name: "Pescara Abruzzo", iataCode: "PSR" },
  { name: "Ancona Falconara", iataCode: "AOI" },
  { name: "Olbia Costa Smeralda", iataCode: "OLB" },
  { name: "Rimini Federico Fellini", iataCode: "RMI" },
  { name: "Trapani Birgi", iataCode: "TPS" },
  { name: "Comiso", iataCode: "CIY" },
  { name: "Lampedusa", iataCode: "LMP" },
  { name: "Pantelleria", iataCode: "PNL" },
  { name: "Reggio Calabria", iataCode: "REG" },
  { name: "Crotone", iataCode: "CRV" },
  { name: "Cuneo Levaldigi", iataCode: "CUF" },
  { name: "Parma", iataCode: "PMF" },
  { name: "Perugia San Francesco", iataCode: "PEG" },
  { name: "Brescia Montichiari", iataCode: "VBS" }
];

// Funzione per aggiungere un ritardo
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function getAirports(): Promise<any[]> {
  // Trasformiamo gli aeroporti italiani in formato compatibile con l'API
  return ITALIAN_AIRPORTS.map(airport => ({
    type: "location",
    subType: "AIRPORT",
    name: airport.name.toUpperCase(),
    detailedName: `${airport.name.toUpperCase()}, IT`,
    id: `A${airport.iataCode}`,
    self: {
      href: `https://test.api.amadeus.com/v1/reference-data/locations/A${airport.iataCode}`,
      methods: ["GET"]
    },
    timeZoneOffset: "+02:00",
    iataCode: airport.iataCode,
    geoCode: {
      latitude: 0, // Coordinate non reali (solo per demo)
      longitude: 0
    },
    address: {
      cityName: airport.name.split(" ")[0].toUpperCase(),
      cityCode: airport.iataCode.substring(0, 3),
      countryName: "ITALY",
      countryCode: "IT",
      regionCode: "EUR"
    },
    analytics: {
      travelers: {
        score: Math.floor(Math.random() * 30) + 10
      }
    }
  }));
}

export async function searchFlights(params: {
  originLocationCode: string;
  destinationLocationCode?: string;
  departureDate: string;
  returnDate?: string;
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
    
    // Fallback con dati di test in caso di errore API
    return [
      {
        id: "1",
        source: "GDS",
        instantTicketingRequired: false,
        nonHomogeneous: false,
        oneWay: false,
        lastTicketingDate: "2023-12-25",
        numberOfBookableSeats: 9,
        itineraries: [{
          duration: "PT2H15M",
          segments: [{
            departure: {
              iataCode: params.originLocationCode,
              at: "2023-12-01T08:30:00"
            },
            arrival: {
              iataCode: "MXP",
              at: "2023-12-01T10:45:00"
            },
            carrierCode: "AZ",
            number: "1234",
            aircraft: {
              code: "320"
            },
            operating: {
              carrierCode: "AZ"
            },
            duration: "PT2H15M",
            id: "1",
            numberOfStops: 0,
            blacklistedInEU: false
          }]
        }],
        price: {
          currency: "EUR",
          total: "89.99",
          base: "69.99",
          fees: [
            {
              amount: "20.00",
              type: "SUPPLIER"
            }
          ],
          grandTotal: "89.99"
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
              total: "89.99",
              base: "69.99"
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
        lastTicketingDate: "2023-12-25",
        numberOfBookableSeats: 5,
        itineraries: [{
          duration: "PT1H45M",
          segments: [{
            departure: {
              iataCode: params.originLocationCode,
              at: "2023-12-01T14:30:00"
            },
            arrival: {
              iataCode: "FCO",
              at: "2023-12-01T16:15:00"
            },
            carrierCode: "FR",
            number: "5678",
            aircraft: {
              code: "737"
            },
            operating: {
              carrierCode: "FR"
            },
            duration: "PT1H45M",
            id: "2",
            numberOfStops: 0,
            blacklistedInEU: false
          }]
        }],
        price: {
          currency: "EUR",
          total: "75.50",
          base: "55.50",
          fees: [
            {
              amount: "20.00",
              type: "SUPPLIER"
            }
          ],
          grandTotal: "75.50"
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
              total: "75.50",
              base: "55.50"
            }
          }
        ]
      }
    ];
  }
}
