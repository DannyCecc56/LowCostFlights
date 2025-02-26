import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { searchFlightsSchema, type Airport } from "@shared/schema";
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
  const { data: airports } = useQuery<Airport[]>({ 
    queryKey: ["/api/airports"]
  });

  const form = useForm({
    resolver: zodResolver(searchFlightsSchema),
    defaultValues: {
      departureAirportId: 0,
      departureDate: "",
      returnDate: undefined,
      maxPrice: undefined
    }
  });

  const onSubmit = (data: any) => {
    const params = new URLSearchParams({
      departureAirportId: data.departureAirportId.toString(),
      departureDate: data.departureDate,
      ...(data.returnDate && { returnDate: data.returnDate }),
      ...(data.maxPrice && { maxPrice: data.maxPrice.toString() })
    });
    setLocation(`/search?${params.toString()}`);
  };

  if (!airports) {
    return <div>Caricamento aeroporti...</div>;
  }

  // Ordina gli aeroporti per città
  const sortedAirports = [...airports].sort((a, b) => a.city.localeCompare(b.city));

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="departureAirportId"
          render={({ field }) => (
            <FormItem className="relative">
              <FormLabel>Aeroporto di partenza</FormLabel>
              <Select 
                onValueChange={(value) => field.onChange(parseInt(value))}
                value={field.value ? field.value.toString() : undefined}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Seleziona aeroporto" />
                </SelectTrigger>
                <SelectContent 
                  className="max-h-[300px] w-[400px] overflow-y-auto"
                  position="popper"
                  side="bottom"
                  align="start"
                >
                  {sortedAirports.map((airport) => (
                    <SelectItem 
                      key={airport.id} 
                      value={airport.id.toString()}
                      className="py-2 px-4 hover:bg-accent cursor-pointer"
                    >
                      <div className="flex flex-col">
                        <span className="font-medium">{airport.city}</span>
                        <span className="text-sm text-muted-foreground">
                          {airport.name} ({airport.code})
                        </span>
                      </div>
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
            name="departureDate"
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
                      selected={field.value ? new Date(field.value) : undefined}
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
            name="returnDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Data ritorno (opzionale)</FormLabel>
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
                      selected={field.value ? new Date(field.value) : undefined}
                      onSelect={(date) => field.onChange(date?.toISOString())}
                      disabled={(date) => {
                        const departureDate = form.getValues("departureDate");
                        return date < (departureDate ? new Date(departureDate) : new Date());
                      }}
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
                <Input 
                  type="number" 
                  {...field}
                  onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full">Cerca Voli</Button>
      </form>
    </Form>
  );
}