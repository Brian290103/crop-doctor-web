import { selectSourcesSchema } from "@/db/schemas/source.schema";
import { z } from "zod";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { deleteSource, trainSourceEmbeddings } from "@/app/actions/source.actions";
import { useState } from "react";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

type Source = z.infer<typeof selectSourcesSchema>;

interface SourceItemProps {
  source: Source;
}

export function SourceItem({ source }: SourceItemProps) {
  const [isTraining, setIsTraining] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const queryClient = useQueryClient();

  const handleTrainEmbeddings = async () => {
    setIsTraining(true);
    const result = await trainSourceEmbeddings(source.id);
    if (result.success) {
      toast.success(result.message);
      queryClient.invalidateQueries({ queryKey: ['sources', source.cropId] });
    } else {
      toast.error(result.message);
    }
    setIsTraining(false);
  };

  const handleDeleteSource = async () => {
    setIsDeleting(true);
    try {
      const result = await deleteSource(source.id);
      if (result) {
        toast.success("Source deleted successfully.");
        queryClient.invalidateQueries({ queryKey: ['sources', source.cropId] });
      }
    } catch (error) {
      console.error("Error deleting source:", error);
      toast.error("Failed to delete source.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-2 text-sm">
      <p><strong>Title:</strong> {source.title}</p>
      <p><strong>Slug:</strong> {source.slug}</p>
      <p><strong>Crop ID:</strong> {source.cropId}</p>
      <p><strong>Type:</strong> {source.type}</p>

      <div className="flex gap-2">
        {source.embeddings && source.embeddings.length === 0 && (
          <Button onClick={handleTrainEmbeddings} disabled={isTraining}>
            {isTraining ? "Training..." : "Train"}
          </Button>
        )}

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" disabled={isDeleting}>
              {isDeleting ? "Deleting..." : "Delete"}
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete your
                source and remove its data from our servers.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDeleteSource}>
                Continue
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="content">
          <AccordionTrigger>Content</AccordionTrigger>
          <AccordionContent>
            <p>{source.content}</p>
          </AccordionContent>
        </AccordionItem>
        {source.metadata && (
          <AccordionItem value="metadata">
            <AccordionTrigger>Metadata</AccordionTrigger>
            <AccordionContent>
              <pre className="whitespace-pre-wrap">{JSON.stringify(source.metadata, null, 2)}</pre>
            </AccordionContent>
          </AccordionItem>
        )}
      </Accordion>
    </div>
  );
}
