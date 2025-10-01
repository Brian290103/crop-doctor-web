"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CirclePlus, Loader } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { createCrop } from "@/app/actions/crop.actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function CreateCropForm() {
  const [name, setName] = useState("");
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: createCrop,
    onSuccess: () => {
      toast.success("Crop created successfully");
      setName("");
      queryClient.invalidateQueries({ queryKey: ["crops"] });
    },
    onError: () => {
      toast.error("Failed to create crop");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name) {
      mutate({ name });
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex w-full max-w-sm items-center space-x-2"
    >
      <Input
        type="text"
        placeholder="New Crop"
        value={name}
        className="w-full"
        onChange={(e) => setName(e.target.value)}
        disabled={isPending}
      />
      <Button type="submit" disabled={isPending || name.length === 0}>
        {isPending ? <Loader className="animate-spin" /> : <CirclePlus />}
      </Button>
    </form>
  );
}
