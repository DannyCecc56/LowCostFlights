// Stock photos from professional sources
// Using Unsplash for high quality, freely usable images
export const STOCK_PHOTOS = {
  destinations: {
    roma: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&q=80",
    milano: "https://images.unsplash.com/photo-1512236258305-32fb110fdb01?auto=format&fit=crop&q=80", 
    venezia: "https://images.unsplash.com/photo-1514890547357-a9ee288728e0?auto=format&fit=crop&q=80",
    napoli: "https://images.unsplash.com/photo-1516483638261-f4dbaf036963?auto=format&fit=crop&q=80",
    catania: "https://images.unsplash.com/photo-1586005745598-30ca35b03b33?auto=format&fit=crop&q=80",
    palermo: "https://images.unsplash.com/photo-1523365280197-f1783db9583d?auto=format&fit=crop&q=80"
  },
  airlines: {
    alitalia: "https://images.unsplash.com/photo-1540962351504-03099e0a754b?auto=format&fit=crop&q=80",
    ryanair: "https://images.unsplash.com/photo-1556388158-158ea5ccacbd?auto=format&fit=crop&q=80",
    easyjet: "https://images.unsplash.com/photo-1570710891163-6d3b5c47248b?auto=format&fit=crop&q=80",
    wizzair: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&q=80",
    ita: "https://images.unsplash.com/photo-1583711014386-95bdc432751f?auto=format&fit=crop&q=80",
    airItaly: "https://images.unsplash.com/photo-1542296332-2e4473faf563?auto=format&fit=crop&q=80"
  }
};

// Timing constants
export const DATE_FORMAT = "dd/MM/yyyy";
export const TIME_FORMAT = "HH:mm";

// Price related constants
export const CURRENCY = "EUR";
export const CURRENCY_SYMBOL = "€";
export const MIN_PRICE = 20;
export const MAX_PRICE = 1000;
export const DEFAULT_MAX_PRICE = 500;

// Search form constants
export const MIN_SEARCH_DAYS = 1;
export const MAX_SEARCH_DAYS = 30;
export const DEFAULT_SEARCH_DAYS = 7;

// Airline company colors (for consistent branding)
export const AIRLINE_COLORS = {
  alitalia: "#078D53",
  ryanair: "#073590",
  easyjet: "#FF6600",
  wizzair: "#C6007E",
  ita: "#00427A",
  airItaly: "#E32D35"
};

// Error messages in Italian
export const ERROR_MESSAGES = {
  INVALID_DATE_RANGE: "Le date selezionate non sono valide",
  REQUIRED_FIELD: "Campo obbligatorio",
  INVALID_EMAIL: "Indirizzo email non valido",
  INVALID_PRICE: "Prezzo non valido",
  BOOKING_FAILED: "Prenotazione fallita, riprova più tardi",
  NO_FLIGHTS: "Nessun volo trovato per i criteri selezionati",
  NETWORK_ERROR: "Errore di connessione, verifica la tua connessione internet"
};

// Success messages in Italian
export const SUCCESS_MESSAGES = {
  BOOKING_CONFIRMED: "Prenotazione confermata con successo!",
  PAYMENT_RECEIVED: "Pagamento ricevuto, grazie per aver scelto il nostro servizio"
};

// Loading messages in Italian
export const LOADING_MESSAGES = {
  SEARCHING_FLIGHTS: "Ricerca voli in corso...",
  PROCESSING_BOOKING: "Elaborazione prenotazione...",
  LOADING_AIRPORTS: "Caricamento aeroporti..."
};

// Navigation routes
export const ROUTES = {
  HOME: "/",
  SEARCH: "/search",
  BOOKING: "/booking",
  NOT_FOUND: "/404"
};

// Form validation constants
export const VALIDATION = {
  MIN_NAME_LENGTH: 3,
  MAX_NAME_LENGTH: 50,
  EMAIL_PATTERN: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i
};

// Page metadata (for SEO)
export const META = {
  title: "ViaggiaLow - Voli Low Cost dall'Italia",
  description: "Trova i voli più economici dagli aeroporti italiani. Confronta prezzi e prenota il tuo prossimo viaggio con ViaggiaLow.",
  keywords: "voli low cost, prenotazione voli, voli economici, viaggi italia"
};
