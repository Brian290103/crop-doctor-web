"use client";

import { CirclePlus, Loader } from "lucide-react";
import { useTransition } from "react";
import { toast } from "sonner";
import { createCrop } from "@/app/actions/crop.actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { useRef } from "react";

export function CreateCropForm() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const name = (new FormData(form).get("name") as string)?.trim();
    console.log("[CreateCropForm] submit name:", name);
    if (!name) return;

    startTransition(async () => {
      try {
        const result = await createCrop({ name });
        console.log("[CreateCropForm] createCrop result:", result);
        toast.success("Crop created successfully");
        form.reset();
        router.refresh();
      } catch (err: any) {
        console.error("[CreateCropForm] createCrop error:", err);
        toast.error(err?.message ?? "Failed to create crop");
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="flex w-full items-center gap-2">
      <Input
        ref={inputRef}
        type="text"
        name="name"
        placeholder="New crop name"
        className="flex-1"
        disabled={isPending}
      />
      <Button type="submit" size="icon" disabled={isPending}>
        {isPending ? <Loader className="size-4 animate-spin" /> : <CirclePlus className="size-4" />}
      </Button>
    </form>
  );
}
