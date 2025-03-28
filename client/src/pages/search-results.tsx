import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import FlightCard from "@/components/flight-card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft } from "lucide-react";
import type { Flight, Airport } from "@shared/schema";

export default function SearchResults() {
  const [, setLocation] = useLocation();
  const searchParams = new URLSearchParams(window.location.search);
  
  // Per debug - mostriamo i parametri che stiamo inviando
  console.log("Parametri di ricerca:", Object.fromEntries(searchParams.entries()));
  
  const { data: flights, isLoading: isLoadingFlights, error } = useQuery<Flight[]>({
    queryKey: ["/api/flights/search", searchParams.toString()],
    retry: false
  });
  
  // Mostriamo eventuali errori
  if (error) {
    console.error("Errore nella ricerca dei voli:", error);
  }

  const { data: airports, isLoading: isLoadingAirports } = useQuery<Airport[]>({
    queryKey: ["/api/airports"],
  });

  if (isLoadingFlights || isLoadingAirports || !flights || !airports) {
    return (
      <div className="container mx-auto p-4">
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-48 w-full" />
          ))}
        </div>
      </div>
    );
  }

  const handleBook = (flightId: number) => {
    setLocation(`/booking/${flightId}`);
  };

  return (
    <div className="container mx-auto p-4">
      <div className="mb-6 flex items-center">
        <Button
          variant="ghost"
          className="mr-4"
          onClick={() => setLocation("/")}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Indietro
        </Button>
        <h1 className="text-2xl font-bold">Risultati ricerca</h1>
      </div>

      <div className="space-y-4">
        {flights.length === 0 ? (
          <p className="text-center text-muted-foreground">
            Nessun volo trovato per i criteri selezionati
          </p>
        ) : (
          flights.map((flight) => {
            const departureAirport = airports.find(a => a.id === flight.departureAirportId);
            const arrivalAirport = airports.find(a => a.id === flight.arrivalAirportId);

            if (!departureAirport || !arrivalAirport) return null;

            return (
              <FlightCard
                key={flight.id}
                flight={flight}
                departureAirport={departureAirport}
                arrivalAirport={arrivalAirport}
                onBook={() => handleBook(flight.id)}
              />
            );
          })
        )}
      </div>
    </div>
  );
}