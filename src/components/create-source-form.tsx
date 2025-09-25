'use client';

import { getCrops } from "@/app/actions/crop.actions";
import { scrapeWebsite } from "@/app/actions/parse.actions";
import { createSource } from "@/app/actions/source.actions";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { resourceTypeEnum } from "@/db/schemas/source.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const formSchema = z.object({
  cropId: z.string().uuid("Invalid Crop ID"),
  title: z.string().min(5, "Title must be at least 5 characters."),
  content: z.string().min(5, "Content must be at least 5 characters."),
  type: z.enum(resourceTypeEnum.enumValues),
  metadata: z.string().optional(),
  url: z.string().url("Invalid URL").optional().or(z.literal("")),
});

type SourceFormValues = z.infer<typeof formSchema>;

export function CreateSourceForm() {
  const queryClient = useQueryClient();

  const { data: crops, isPending: isCropsPending } = useQuery({
    queryKey: ['crops'],
    queryFn: getCrops,
  });

  const form = useForm<SourceFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      cropId: crops && crops.length > 0 ? crops[0].id : "", // Dynamically set default cropId
      title: "",
      content: "",
      type: "text",
    },
  });

  const selectedType = form.watch("type");
  const urlValue = form.watch("url");

  console.log("form", form);
  const { mutate: create, isPending: isCreating } = useMutation({
    mutationFn: createSource,
    onSuccess: (data) => {
      if (data?.error) {
        toast.error(data.error);
      } else {
        toast.success("Source created successfully!");
      }
      console.log("Source creation response:", data);
      form.reset();
      queryClient.invalidateQueries({ queryKey: ['sources'] });
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to create source.");
      console.error(error);
    },
  });

  const { mutate: scrape, isPending: isScraping } = useMutation({
    mutationFn: scrapeWebsite,
    onSuccess: (data) => {
      toast.success("Website scraped successfully!");
      form.setValue("title", data.metadata?.title || "");
      form.setValue("content", data.markdown || "");
      form.setValue("metadata", JSON.stringify(data.metadata || {}, null, 2));
    },
    onError: (error) => {
      toast.error("Failed to scrape website.");
      console.error(error);
    },
  });

  const handleScrape = () => {
    if (urlValue) {
      scrape(urlValue);
    } else {
      form.setError("url", { message: "URL is required for scraping." });
    }
  };

  const onSubmit = (values: SourceFormValues) => {
    console.log("values", values);
    try {
      const parsedMetadata = values.metadata ? JSON.parse(values.metadata) : {};
      create({ ...values, metadata: parsedMetadata });
    } catch (e) {
      form.setError("metadata", { message: "Invalid JSON for metadata" });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="cropId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Crop</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a crop" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {isCropsPending ? (
                    <SelectItem value="" disabled>Loading crops...</SelectItem>
                  ) : (
                    crops?.map((crop: { id: string; name: string }) => (
                      <SelectItem key={crop.id} value={crop.id}>
                        {crop.name}
                      </SelectItem>
                    ))
                  )}
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
              <Select onValueChange={field.onChange} defaultValue={field.value}>
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
              <FormDescription>The type of the source (e.g., text, website).</FormDescription>
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
                <FormLabel>
                  {selectedType === "website" ? "Website URL" : "File Path/Name"}
                </FormLabel>
                <div className="flex space-x-2">
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
                <Textarea placeholder="Source content" {...field} />
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
                <Textarea placeholder="{}" {...field} />
              </FormControl>
              <FormDescription>Optional JSON metadata for the source.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isCreating}>
          {isCreating ? "Creating..." : "Create Source"}
        </Button>
      </form>
    </Form>
  );
}
