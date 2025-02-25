import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plane, Clock } from "lucide-react";
import type { Flight, Airport } from "@shared/schema";
import { formatDate, formatTime } from "@/lib/utils/dates";

interface FlightCardProps {
  flight: Flight;
  departureAirport: Airport;
  arrivalAirport: Airport;
  onBook: () => void;
}

export default function FlightCard({ 
  flight, 
  departureAirport, 
  arrivalAirport, 
  onBook 
}: FlightCardProps) {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex items-center space-x-2">
          <Plane className="h-5 w-5 text-primary" />
          <span className="font-semibold">{flight.airline}</span>
        </div>
        <span className="text-2xl font-bold">€{flight.price}</span>
      </CardHeader>
      
      <CardContent>
        <div className="flex justify-between items-center mb-4">
          <div>
            <p className="text-sm text-muted-foreground">Partenza</p>
            <p className="font-semibold">{departureAirport.city}</p>
            <p className="text-sm">{formatTime(flight.departureTime)}</p>
          </div>
          
          <div className="flex-1 border-t border-dashed mx-4 relative">
            <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-background px-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
            </span>
          </div>

          <div className="text-right">
            <p className="text-sm text-muted-foreground">Arrivo</p>
            <p className="font-semibold">{arrivalAirport.city}</p>
            <p className="text-sm">{formatTime(flight.arrivalTime)}</p>
          </div>
        </div>

        <div className="text-sm text-muted-foreground">
          <p>Volo {flight.flightNumber}</p>
          <p>{formatDate(flight.departureTime)}</p>
        </div>
      </CardContent>

      <CardFooter>
        <Button onClick={onBook} className="w-full">
          Prenota
        </Button>
      </CardFooter>
    </Card>
  );
}
