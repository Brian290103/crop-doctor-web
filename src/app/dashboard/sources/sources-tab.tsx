'use client';

import { getCrops } from "@/app/actions/crop.actions";
import { getSources } from "@/app/actions/source.actions";
import { CreateCropForm } from "@/components/create-crop-form";
import { CropItem } from "@/components/crop-item";
import { SourceItem } from "@/components/source-item";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Source } from "@/db/schemas/source.schema";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";


const SourcesTab = () => {
  const [selectedCropId, setSelectedCropId] = useState<string | undefined>(undefined);

  const { data: crops, isPending: isCropsPending } = useQuery({
    queryKey: ['crops'],
    queryFn: getCrops,
  });

  const { data: sources, isPending: isSourcesPending } = useQuery({
    queryKey: ['sources', selectedCropId],
    queryFn: () => getSources(selectedCropId),
    enabled: !!selectedCropId, // Only fetch sources if a crop is selected
  });

  console.log("sources",sources)
  useEffect(() => {
    if (crops && crops.length > 0 && !selectedCropId) {
      setSelectedCropId(crops[0].id);
    }
  }, [crops, selectedCropId]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
   <div className="w-full flex flex-col items-center gap-3">
   <Card className="w-full">
        <CardHeader>
          <CardTitle>Crops</CardTitle>
          <CardDescription>Manage your crops</CardDescription>
        </CardHeader>
        <CardContent>
        <CreateCropForm />
        </CardContent>
        </Card><Card className="w-full">
        <CardContent>
          {isCropsPending ? (
            <p>Loading crops...</p>
          ) : (
            <ul>
              {crops?.map((crop: { id: string; name: string }) => (
                <CropItem key={crop.id} crop={crop} onClick={setSelectedCropId} />
              ))}
            </ul>
          )}
        
        </CardContent>
      </Card>
   </div>
      <div className="lg:col-span-2 w-full flex flex-col gap-3">
      <Card>
        <CardHeader>
          <CardTitle>Sources</CardTitle>
          <CardDescription>Manage your sources</CardDescription>
        </CardHeader>
        </Card> 
          {isSourcesPending ? (
            <Card>
        <CardContent><p>Loading sources...</p> </CardContent>
        </Card>
          ) : (
            <div className="grid gap-3">
              {sources?.map((source: Source) => (
                <Card key={source.id}>
                  <CardHeader>
                    <CardTitle>{source.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <SourceItem source={source} />
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        
      </div>
    </div>
  );
};

export default SourcesTab;
