import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import FlightCard from "@/components/flight-card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft } from "lucide-react";
import { ERROR_MESSAGES } from "@/lib/constants";
import type { Flight, Airport } from "@shared/schema";

export default function SearchResults() {
  const [, setLocation] = useLocation();
  const searchParams = new URLSearchParams(window.location.search);

  console.log("Parametri di ricerca:", Object.fromEntries(searchParams.entries()));

  const { data: airports, isLoading: isLoadingAirports } = useQuery<Airport[]>({
    queryKey: ["/api/airports"],
  });

  const { data: flights, isLoading: isLoadingFlights, error } = useQuery<Flight[]>({
    queryKey: ["/api/flights/search", searchParams.toString()],
    retry: false
  });

  const renderContent = () => {
    if (isLoadingFlights || isLoadingAirports) {
      return (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-48 w-full" />
          ))}
        </div>
      );
    }

    if (error) {
      return (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
          <strong className="font-bold">Errore! </strong>
          <span className="block sm:inline">{ERROR_MESSAGES.NO_FLIGHTS}</span>
        </div>
      );
    }

    if (!flights?.length) {
      return (
        <p className="text-center text-muted-foreground">
          {ERROR_MESSAGES.NO_FLIGHTS}
        </p>
      );
    }

    return (
      <div className="space-y-4">
        {flights.map((flight) => (
          <FlightCard 
            key={flight.id}
            flight={flight}
            departureAirport={airports?.find(a => a.id === flight.departureAirportId)}
            arrivalAirport={airports?.find(a => a.id === flight.arrivalAirportId)}
            onBook={() => setLocation(`/booking/${flight.id}`)}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="container mx-auto p-4">
      <Button
        variant="ghost"
        className="mb-6"
        onClick={() => setLocation("/")}
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Torna alla ricerca
      </Button>

      {renderContent()}
    </div>
  );
}