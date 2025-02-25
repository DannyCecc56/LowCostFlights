import { Card, CardContent } from "@/components/ui/card";
import { Plane } from "lucide-react";
import SearchForm from "@/components/search-form";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-100 to-white">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center mb-8">
          <Plane className="h-8 w-8 text-primary mr-2" />
          <h1 className="text-3xl font-bold text-primary">ViaggiaLow</h1>
        </div>

        <div className="max-w-3xl mx-auto">
          <Card className="shadow-lg">
            <CardContent className="p-6">
              <h2 className="text-2xl font-semibold mb-6 text-center">
                Trova i voli più economici dall'Italia
              </h2>
              <SearchForm />
            </CardContent>
          </Card>

          <div className="mt-12 grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="bg-primary/10 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Plane className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Voli Low Cost</h3>
              <p className="text-muted-foreground">Le migliori tariffe garantite</p>
            </div>
            {/* Add more features/benefits */}
          </div>
        </div>
      </div>
    </div>
  );
}
