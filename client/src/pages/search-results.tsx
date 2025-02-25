import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import FlightCard from "@/components/flight-card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft } from "lucide-react";

export default function SearchResults() {
  const [, setLocation] = useLocation();
  const searchParams = new URLSearchParams(window.location.search);

  const { data: flights, isLoading: isLoadingFlights } = useQuery({
    queryKey: ["/api/flights/search", searchParams.toString()],
  });

  const { data: airports, isLoading: isLoadingAirports } = useQuery({
    queryKey: ["/api/airports"],
  });

  if (isLoadingFlights || isLoadingAirports) {
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
        {flights?.length === 0 ? (
          <p className="text-center text-muted-foreground">
            Nessun volo trovato per i criteri selezionati
          </p>
        ) : (
          flights?.map((flight) => (
            <FlightCard
              key={flight.id}
              flight={flight}
              departureAirport={airports?.find(a => a.id === flight.departureAirportId)!}
              arrivalAirport={airports?.find(a => a.id === flight.arrivalAirportId)!}
              onBook={() => handleBook(flight.id)}
            />
          ))
        )}
      </div>
    </div>
  );
}
