
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
  
  const { data: airports } = useQuery<Airport[]>({
    queryKey: ["/api/airports"],
  });

  const { data: flights, isLoading, error } = useQuery<Flight[]>({
    queryKey: ["/api/flights/search", searchParams.toString()],
    retry: false
  });

  if (isLoading) {
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

  if (error) {
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
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
          <strong className="font-bold">Errore! </strong>
          <span className="block sm:inline">{ERROR_MESSAGES.NO_FLIGHTS}</span>
        </div>
      </div>
    );
  }

  if (!flights || flights.length === 0) {
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
        <div className="text-center py-8">
          <p className="text-muted-foreground">{ERROR_MESSAGES.NO_FLIGHTS}</p>
        </div>
      </div>
    );
  }

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

      <div className="space-y-4">
        {flights.map((flight) => (
          <FlightCard 
            key={flight.id} 
            flight={flight} 
            departureAirport={airports?.find(a => a.id === flight.departureAirportId)}
            arrivalAirport={airports?.find(a => a.id === flight.arrivalAirportId)}
          />
        ))}
      </div>
    </div>
  );
}
