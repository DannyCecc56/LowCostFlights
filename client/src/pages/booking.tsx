import { useQuery, useMutation } from "@tanstack/react-query";
import { useParams, useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertBookingSchema } from "@shared/schema";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { formatDate, formatTime } from "@/lib/utils/dates";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { ArrowLeft } from "lucide-react";
import { formatDate, formatTime } from "@/lib/utils/dates";

export default function Booking() {
  const { id } = useParams();
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const { data: flight, isLoading: isLoadingFlight } = useQuery({
    queryKey: [`/api/flights/${id}`],
  });

  const { data: airports } = useQuery({
    queryKey: ["/api/airports"],
  });

  const form = useForm({
    resolver: zodResolver(insertBookingSchema),
    defaultValues: {
      flightId: parseInt(id),
      passengerName: "",
      passengerEmail: "",
    },
  });

  const bookingMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await apiRequest("POST", "/api/bookings", data);
      return res.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Prenotazione confermata!",
        description: `Riferimento prenotazione: ${data.bookingReference}`,
      });
      setLocation("/");
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: "Errore",
        description: "Impossibile completare la prenotazione",
      });
    },
  });

  if (isLoadingFlight) {
    return <div>Caricamento...</div>;
  }

  if (!flight) {
    return <div>Volo non trovato</div>;
  }

  const departureAirport = airports?.find(a => a.id === flight.departureAirportId);
  const arrivalAirport = airports?.find(a => a.id === flight.arrivalAirportId);

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <Button
        variant="ghost"
        className="mb-6"
        onClick={() => window.history.back()}
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Indietro
      </Button>

      <Card>
        <CardHeader>
          <h1 className="text-2xl font-bold">Prenota il tuo volo</h1>
          <div className="space-y-2">
            <p className="text-muted-foreground">
              {departureAirport?.city} → {arrivalAirport?.city}
            </p>
            <div className="text-sm space-y-1">
              <p>Volo {flight.flightNumber} - {flight.airline}</p>
              <p>Partenza: {formatDate(flight.departureTime)} {formatTime(flight.departureTime)}</p>
              <p>Arrivo: {formatDate(flight.arrivalTime)} {formatTime(flight.arrivalTime)}</p>
              <p className="font-semibold">Prezzo: €{flight.price}</p>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit((data) => bookingMutation.mutate(data))}
              className="space-y-4"
            >
              <FormField
                control={form.control}
                name="passengerName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome completo</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="passengerEmail"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="pt-4">
                <Button
                  type="submit"
                  className="w-full"
                  disabled={bookingMutation.isPending}
                >
                  {bookingMutation.isPending
                    ? "Elaborazione..."
                    : `Conferma e paga €${flight.price}`}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}