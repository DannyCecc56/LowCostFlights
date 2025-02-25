import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { searchFlightsSchema } from "@shared/schema";
import { Form, FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { formatDate } from "@/lib/utils/dates";
import { CalendarIcon } from "lucide-react";

export default function SearchForm() {
  const [, setLocation] = useLocation();
  const { data: airports, isLoading } = useQuery({ 
    queryKey: ["/api/airports"]
  });

  const form = useForm({
    resolver: zodResolver(searchFlightsSchema),
    defaultValues: {
      departureAirportId: 0,
      startDate: "",
      endDate: "",
      maxPrice: undefined
    }
  });

  const onSubmit = (data: any) => {
    const params = new URLSearchParams({
      departureAirportId: data.departureAirportId.toString(),
      startDate: data.startDate,
      endDate: data.endDate,
      ...(data.maxPrice && { maxPrice: data.maxPrice.toString() })
    });
    setLocation(`/search?${params.toString()}`);
  };

  if (isLoading) {
    return <div>Caricamento aeroporti...</div>;
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="departureAirportId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Aeroporto di partenza</FormLabel>
              <Select onValueChange={field.onChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleziona aeroporto" />
                </SelectTrigger>
                <SelectContent>
                  {airports?.map((airport) => (
                    <SelectItem key={airport.id} value={airport.id.toString()}>
                      {airport.city} ({airport.code})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="startDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Data partenza</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left font-normal">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {field.value ? formatDate(field.value) : "Seleziona data"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={new Date(field.value)}
                      onSelect={(date) => field.onChange(date?.toISOString())}
                      disabled={(date) => date < new Date()}
                    />
                  </PopoverContent>
                </Popover>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="endDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Data ritorno</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left font-normal">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {field.value ? formatDate(field.value) : "Seleziona data"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={new Date(field.value)}
                      onSelect={(date) => field.onChange(date?.toISOString())}
                      disabled={(date) => date < new Date(form.getValues("startDate"))}
                    />
                  </PopoverContent>
                </Popover>
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="maxPrice"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Prezzo massimo (€)</FormLabel>
              <FormControl>
                <Input type="number" {...field} />
              </FormControl>
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full">Cerca Voli</Button>
      </form>
    </Form>
  );
}
