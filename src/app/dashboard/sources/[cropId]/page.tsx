import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Brain, Layers, Zap } from "lucide-react";
import { getCropById, getSourcesByCropId, getCropsData } from "@/lib/data";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { SourceItem } from "@/components/source-item";
import { CropItem } from "@/components/crop-item";
import AddSourceSheet from "../add-source-sheet";
import type { Source } from "@/db/schemas/source.schema";

interface CropSourcesPageProps {
  params: Promise<{ cropId: string }>;
}

export default async function CropSourcesPage({ params }: CropSourcesPageProps) {
  const { cropId } = await params;

  const [crop, sources, allCrops] = await Promise.all([
    getCropById(cropId),
    getSourcesByCropId(cropId),
    getCropsData(),
  ]);

  if (!crop) notFound();

  const trainedCount = sources.filter((s) => s.embeddings.length > 0).length;
  const untrainedCount = sources.length - trainedCount;

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col gap-3">
        <Link
          href="/dashboard/sources"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors w-fit"
        >
          <ArrowLeft className="size-3.5" />
          All Crops
        </Link>

        <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">{crop.name}</h1>
            <p className="text-muted-foreground text-sm mt-0.5 font-mono">{crop.slug}</p>
          </div>
          <div className="flex items-center gap-2">
            <ul className="m-0 p-0 list-none">
              <CropItem crop={crop} href="/dashboard/sources" isSelected={false} />
            </ul>
            <AddSourceSheet crops={allCrops} defaultCropId={crop.id} />
          </div>
        </div>

        {/* Stats row */}
        <div className="flex flex-wrap gap-2">
          <Badge variant="secondary" className="gap-1.5 text-xs">
            <Layers className="size-3" />
            {sources.length} sources
          </Badge>
          <Badge variant="outline" className="gap-1.5 text-xs bg-green-50 text-green-700 border-green-200">
            <Zap className="size-3 fill-green-500" />
            {trainedCount} trained
          </Badge>
          {untrainedCount > 0 && (
            <Badge variant="outline" className="gap-1.5 text-xs bg-yellow-50 text-yellow-700 border-yellow-200">
              <Brain className="size-3" />
              {untrainedCount} need training
            </Badge>
          )}
        </div>
      </div>

      {/* Sources Grid */}
      {sources.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-20 text-center">
            <Layers className="size-12 text-muted-foreground/25 mb-4" />
            <p className="text-base font-semibold text-muted-foreground">No sources yet</p>
            <p className="text-sm text-muted-foreground/60 mt-1 mb-4">
              Add your first knowledge source for <strong>{crop.name}</strong>
            </p>
            <AddSourceSheet crops={allCrops} defaultCropId={crop.id} />
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {sources.map((source) => (
            <Card key={source.id} className="flex flex-col hover:shadow-sm transition-shadow">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold leading-tight line-clamp-2">
                  {source.title}
                </CardTitle>
                <CardDescription className="text-xs font-mono truncate">
                  {source.slug}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-1">
                <SourceItem source={source as unknown as Source} />
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}