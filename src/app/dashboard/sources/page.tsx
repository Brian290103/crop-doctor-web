import Link from "next/link";
import { ChevronRight, Layers, Sprout } from "lucide-react";
import { getCropsData } from "@/lib/data";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CreateCropForm } from "@/components/create-crop-form";
import AddSourceSheet from "./add-source-sheet";

export default async function SourcesPage() {
  const crops = await getCropsData();

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Sources</h1>
          <p className="text-muted-foreground text-sm mt-0.5">
            Select a crop to manage its knowledge sources
          </p>
        </div>
        <AddSourceSheet crops={crops} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Add Crop */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <Sprout className="size-4 text-green-600" />
              Add New Crop
            </CardTitle>
            <CardDescription className="text-xs">
              Create a new crop category for the knowledge base
            </CardDescription>
          </CardHeader>
          <CardContent>
            <CreateCropForm />
          </CardContent>
        </Card>

        {/* Crops Grid */}
        <Card className="lg:col-span-2">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <Layers className="size-4 text-blue-500" />
              Crops ({crops.length})
            </CardTitle>
            <CardDescription className="text-xs">
              Click a crop to view and manage its sources
            </CardDescription>
          </CardHeader>
          <CardContent>
            {crops.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Sprout className="size-10 text-muted-foreground/30 mb-3" />
                <p className="text-sm font-medium text-muted-foreground">No crops yet</p>
                <p className="text-xs text-muted-foreground/60 mt-1">
                  Create your first crop using the form on the left
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {crops.map((crop) => (
                  <Link
                    key={crop.id}
                    href={`/dashboard/sources/${crop.id}`}
                    className="group flex items-center justify-between rounded-xl border p-4 hover:border-primary/40 hover:bg-primary/5 transition-all duration-150"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex size-9 items-center justify-center rounded-lg bg-green-100 text-green-600 group-hover:bg-green-500 group-hover:text-white transition-colors">
                        <Sprout className="size-4" />
                      </div>
                      <div>
                        <p className="font-semibold text-sm">{crop.name}</p>
                        <p className="text-xs text-muted-foreground font-mono">{crop.slug}</p>
                      </div>
                    </div>
                    <ChevronRight className="size-4 text-muted-foreground/50 group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
