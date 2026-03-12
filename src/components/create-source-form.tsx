"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { scrapeWebsite } from "@/app/actions/parse.actions";
import { createSource } from "@/app/actions/source.actions";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { resourceTypeEnum } from "@/db/schemas/source.schema";
import { useRouter } from "next/navigation";

const formSchema = z.object({
  cropId: z.string().uuid("Invalid Crop ID"),
  title: z.string().min(5, "Title must be at least 5 characters."),
  content: z.string().min(5, "Content must be at least 5 characters."),
  type: z.enum(resourceTypeEnum.enumValues),
  metadata: z.string().optional(),
  url: z.string().url("Invalid URL").optional().or(z.literal("")),
});

type SourceFormValues = z.infer<typeof formSchema>;

interface CreateSourceFormProps {
  crops: { id: string; name: string }[];
  defaultCropId?: string;
  onSuccess?: () => void;
}

export function CreateSourceForm({ crops, defaultCropId, onSuccess }: CreateSourceFormProps) {
  const router = useRouter();
  const [isCreating, startCreate] = useTransition();
  const [isScraping, startScrape] = useTransition();

  const form = useForm<SourceFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      cropId: defaultCropId ?? (crops[0]?.id ?? ""),
      title: "",
      content: "",
      type: "text",
      url: "",
      metadata: "",
    },
  });

  const selectedType = form.watch("type");
  const urlValue = form.watch("url");

  const handleScrape = () => {
    if (!urlValue) {
      form.setError("url", { message: "URL is required for scraping." });
      return;
    }
    startScrape(async () => {
      try {
        const data = await scrapeWebsite(urlValue);
        toast.success("Website scraped successfully!");
        form.setValue("title", data.metadata?.title || "");
        form.setValue("content", data.markdown || "");
        form.setValue("metadata", JSON.stringify(data.metadata || {}, null, 2));
      } catch {
        toast.error("Failed to scrape website.");
      }
    });
  };

  const onSubmit = (values: SourceFormValues) => {
    console.log("[CreateSourceForm] submit values:", { ...values, content: values.content?.slice(0, 50) });
    startCreate(async () => {
      try {
        const parsedMetadata = values.metadata ? JSON.parse(values.metadata) : {};
        const data = await createSource({
          cropId: values.cropId,
          title: values.title,
          content: values.content,
          type: values.type,
          metadata: parsedMetadata,
        });
        console.log("[CreateSourceForm] createSource result:", data);
        toast.success("Source created successfully!");
        form.reset({ cropId: values.cropId, title: "", content: "", type: "text", url: "", metadata: "" });
        router.refresh();
        onSuccess?.();
      } catch (e: any) {
        console.error("[CreateSourceForm] createSource error:", e);
        if (e instanceof SyntaxError) {
          form.setError("metadata", { message: "Invalid JSON for metadata" });
        } else {
          toast.error(e?.message ?? "Failed to create source.");
        }
      }
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="cropId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Crop</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a crop" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {crops.map((crop) => (
                    <SelectItem key={crop.id} value={crop.id}>
                      {crop.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormDescription>Select the crop this source belongs to.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Type</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select source type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {resourceTypeEnum.enumValues.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormDescription>The type of source (text, website, or file).</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {(selectedType === "website" || selectedType === "file") && (
          <FormField
            control={form.control}
            name="url"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{selectedType === "website" ? "Website URL" : "File Path/Name"}</FormLabel>
                <div className="flex gap-2">
                  <FormControl>
                    <Input
                      placeholder={selectedType === "website" ? "https://example.com" : "e.g., document.pdf"}
                      {...field}
                    />
                  </FormControl>
                  {selectedType === "website" && (
                    <Button type="button" onClick={handleScrape} disabled={isScraping || !urlValue}>
                      {isScraping ? <Loader2 className="h-4 w-4 animate-spin" /> : "Scrape"}
                    </Button>
                  )}
                </div>
                <FormDescription>
                  {selectedType === "website" ? "Enter the URL to fetch content from." : "Enter the path or name of the file."}
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Source title" {...field} />
              </FormControl>
              <FormDescription>The title of the source.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Content</FormLabel>
              <FormControl>
                <Textarea placeholder="Source content" rows={6} {...field} />
              </FormControl>
              <FormDescription>The main content of the source.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="metadata"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Metadata (JSON)</FormLabel>
              <FormControl>
                <Textarea placeholder="{}" rows={3} {...field} />
              </FormControl>
              <FormDescription>Optional JSON metadata for the source.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isCreating} className="w-full">
          {isCreating ? (
            <><Loader2 className="mr-2 size-4 animate-spin" />Creating...</>
          ) : (
            "Create Source"
          )}
        </Button>
      </form>
    </Form>
  );
}
