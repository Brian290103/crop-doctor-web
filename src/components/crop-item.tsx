"use client";

import { Check, Loader2, Pencil, Trash2 } from "lucide-react";
import { useTransition, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { deleteCrop, updateCrop } from "@/app/actions/crop.actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { IconSeeding } from "@tabler/icons-react";
import { useRouter } from "next/navigation";

interface CropItemProps {
  crop: { id: string; name: string };
  href?: string;
  isSelected?: boolean;
}

export function CropItem({ crop, href, isSelected }: CropItemProps) {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(crop.name);
  const [isUpdating, startUpdate] = useTransition();
  const [isDeleting, startDelete] = useTransition();
  const itemRef = useRef<HTMLLIElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (itemRef.current && !itemRef.current.contains(event.target as Node)) {
        if (isEditing && !isUpdating && !isDeleting) {
          setIsEditing(false);
          setName(crop.name);
        }
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isEditing, crop.name, isUpdating, isDeleting]);

  const handleUpdate = () => {
    if (!name.trim()) return;
    startUpdate(async () => {
      try {
        await updateCrop(crop.id, { name });
        toast.success("Crop updated");
        setIsEditing(false);
        router.refresh();
      } catch (err: any) {
        toast.error(err?.message ?? "Failed to update crop");
      }
    });
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    startDelete(async () => {
      try {
        await deleteCrop(crop.id);
        toast.success("Crop deleted");
        if (href) {
          router.push(href);
        } else {
          router.refresh();
        }
      } catch (err: any) {
        toast.error(err?.message ?? "Failed to delete crop");
      }
    });
  };

  return (
    <li
      ref={itemRef}
      className={cn(
        "group flex items-center gap-2 rounded-lg px-3 py-2 cursor-pointer transition-all duration-150",
        "hover:bg-accent",
        isSelected
          ? "bg-primary/10 text-primary border border-primary/20"
          : "text-foreground/80 hover:text-foreground",
      )}
      onClick={() => !isEditing && href && router.push(href)}
    >
      <IconSeeding
        className={cn(
          "size-4 shrink-0 transition-colors",
          isSelected ? "text-primary" : "text-muted-foreground group-hover:text-foreground",
        )}
      />

      {isEditing ? (
        <Input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="h-7 text-sm flex-1"
          autoFocus
          onClick={(e) => e.stopPropagation()}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleUpdate();
            if (e.key === "Escape") { setIsEditing(false); setName(crop.name); }
          }}
        />
      ) : (
        <span className="flex-1 text-sm font-medium truncate">{crop.name}</span>
      )}

      <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
        {isEditing ? (
          <Button size="icon" variant="ghost" className="size-6"
            onClick={(e) => { e.stopPropagation(); handleUpdate(); }}
            disabled={isUpdating}
          >
            {isUpdating ? <Loader2 className="size-3 animate-spin" /> : <Check className="size-3 text-green-600" />}
          </Button>
        ) : (
          <Button size="icon" variant="ghost" className="size-6"
            onClick={(e) => { e.stopPropagation(); setIsEditing(true); }}
          >
            <Pencil className="size-3" />
          </Button>
        )}
        <Button size="icon" variant="ghost"
          className="size-6 hover:text-destructive hover:bg-destructive/10"
          onClick={handleDelete}
          disabled={isDeleting}
        >
          {isDeleting ? <Loader2 className="size-3 animate-spin" /> : <Trash2 className="size-3" />}
        </Button>
      </div>
    </li>
  );
}
