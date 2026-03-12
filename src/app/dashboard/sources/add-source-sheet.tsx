"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { CreateSourceForm } from "@/components/create-source-form";

interface AddSourceSheetProps {
  crops: { id: string; name: string }[];
  defaultCropId?: string;
}

export default function AddSourceSheet({
  crops,
  defaultCropId,
}: AddSourceSheetProps) {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button className="gap-1.5">
          <Plus className="size-4" />
          Add Source
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-xl overflow-y-auto px-5 pb-5">
        <SheetHeader className="mb-6">
          <SheetTitle>Add New Source</SheetTitle>
          <SheetDescription>
            Add a knowledge source to train the AI. Paste text, scrape a
            website, or reference a file.
          </SheetDescription>
        </SheetHeader>
        <CreateSourceForm
          crops={crops}
          defaultCropId={defaultCropId}
          onSuccess={() => setOpen(false)}
        />
      </SheetContent>
    </Sheet>
  );
}
