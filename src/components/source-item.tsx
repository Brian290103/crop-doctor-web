"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import type { z } from "zod";
import {
  deleteSource,
  trainSourceEmbeddings,
} from "@/app/actions/source.actions";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
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
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { selectSourcesSchema } from "@/db/schemas/source.schema";
import {
  Brain,
  ExternalLink,
  FileText,
  Globe,
  Loader2,
  Trash2,
  Zap,
} from "lucide-react";
import { useRouter } from "next/navigation";

type Source = z.infer<typeof selectSourcesSchema>;

interface SourceItemProps {
  source: Source;
}

const typeConfig = {
  text: {
    icon: FileText,
    label: "Text",
    color: "bg-blue-100 text-blue-700 border-blue-200",
  },
  website: {
    icon: Globe,
    label: "Website",
    color: "bg-purple-100 text-purple-700 border-purple-200",
  },
  file: {
    icon: FileText,
    label: "File",
    color: "bg-orange-100 text-orange-700 border-orange-200",
  },
};

export function SourceItem({ source }: SourceItemProps) {
  const router = useRouter();
  const [isTraining, startTrain] = useTransition();
  const [isDeleting, startDelete] = useTransition();

  const handleTrainEmbeddings = () => {
    startTrain(async () => {
      const result = await trainSourceEmbeddings(source.id);
      if (result.success) {
        toast.success(result.message);
        router.refresh();
      } else {
        toast.error(result.message);
      }
    });
  };

  const handleDeleteSource = () => {
    startDelete(async () => {
      try {
        await deleteSource(source.id);
        toast.success("Source deleted successfully.");
        router.refresh();
      } catch (error) {
        console.error("Error deleting source:", error);
        toast.error("Failed to delete source.");
      }
    });
  };

  const isTrained = source.embeddings && source.embeddings.length > 0;
  const typeInfo =
    typeConfig[source.type as keyof typeof typeConfig] ?? typeConfig.text;
  const TypeIcon = typeInfo.icon;

  return (
    <div className="space-y-3">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2 flex-wrap">
          <Badge variant="outline" className={typeInfo.color}>
            <TypeIcon className="size-3 mr-1" />
            {typeInfo.label}
          </Badge>
          {isTrained ? (
            <Badge
              variant="outline"
              className="bg-green-50 text-green-700 border-green-200"
            >
              <Zap className="size-3 mr-1 fill-green-500" />
              Trained
            </Badge>
          ) : (
            <Badge
              variant="outline"
              className="bg-yellow-50 text-yellow-700 border-yellow-200"
            >
              <Brain className="size-3 mr-1" />
              Not Trained
            </Badge>
          )}
        </div>

        <div className="flex items-center gap-1 shrink-0">
          {source.type === "website" &&
            source.metadata &&
            (source.metadata as any).url && (
              <Button size="icon" variant="ghost" className="size-7" asChild>
                <a
                  href={(source.metadata as any).url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ExternalLink className="size-3.5" />
                </a>
              </Button>
            )}

          {!isTrained && (
            <Button
              size="sm"
              variant="outline"
              className="h-7 text-xs gap-1.5 text-green-700 border-green-200 hover:bg-green-50 hover:text-green-800"
              onClick={handleTrainEmbeddings}
              disabled={isTraining}
            >
              {isTraining ? (
                <Loader2 className="size-3 animate-spin" />
              ) : (
                <Brain className="size-3" />
              )}
              {isTraining ? "Training..." : "Train"}
            </Button>
          )}

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                size="icon"
                variant="ghost"
                className="size-7 hover:text-destructive hover:bg-destructive/10"
                disabled={isDeleting}
              >
                {isDeleting ? (
                  <Loader2 className="size-3 animate-spin" />
                ) : (
                  <Trash2 className="size-3.5" />
                )}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete source?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will permanently delete <strong>{source.title}</strong>{" "}
                  and all its embeddings. This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDeleteSource}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="content" className="border rounded-md px-3">
          <AccordionTrigger className="text-xs font-medium py-2 hover:no-underline">
            View Content
          </AccordionTrigger>
          <AccordionContent>
            <p className="text-sm text-muted-foreground leading-relaxed line-clamp-10">
              {source.content}
            </p>
          </AccordionContent>
        </AccordionItem>
        {source.metadata && (
          <AccordionItem
            value="metadata"
            className="border rounded-md px-3 mt-1"
          >
            <AccordionTrigger className="text-xs font-medium py-2 hover:no-underline">
              Metadata
            </AccordionTrigger>
            <AccordionContent>
              <pre className="whitespace-pre-wrap text-xs text-muted-foreground bg-muted rounded p-2">
                {JSON.stringify(source.metadata, null, 2)}
              </pre>
            </AccordionContent>
          </AccordionItem>
        )}
      </Accordion>
    </div>
  );
}
