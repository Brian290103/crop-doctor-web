'use client';

import { useState, useRef, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { updateCrop, deleteCrop } from '@/app/actions/crop.actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Check, Pencil, Trash, Loader2 } from 'lucide-react';

interface CropItemProps {
  crop: { id: string; name: string };
  onClick: (cropId: string) => void;
}

export function CropItem({ crop, onClick }: CropItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(crop.name);
  const queryClient = useQueryClient();
  const itemRef = useRef<HTMLLIElement>(null);

  const { mutate: update, isPending: isUpdating } = useMutation({
    mutationFn: () => updateCrop(crop.id, { name }),
    onSuccess: () => {
      toast.success('Crop updated successfully');
      setIsEditing(false);
      queryClient.invalidateQueries({ queryKey: ['crops'] });
    },
    onError: () => {
      toast.error('Failed to update crop');
    },
  });

  const { mutate: remove, isPending: isDeleting } = useMutation({
    mutationFn: () => deleteCrop(crop.id),
    onSuccess: () => {
      toast.success('Crop deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['crops'] });
    },
    onError: () => {
      toast.error('Failed to delete crop');
    },
  });

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (itemRef.current && !itemRef.current.contains(event.target as Node)) {
        if (isEditing && !isUpdating && !isDeleting) {
          setIsEditing(false);
          setName(crop.name); // Revert to original name
        }
      }
    };

    if (!isUpdating && !isDeleting) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isEditing, crop.name, isUpdating, isDeleting]);

  const handleUpdate = () => {
    if (name) {
      update();
    }
  };

  return (
    <li ref={itemRef} className="flex items-center justify-between py-1 cursor-pointer" onClick={() => onClick(crop.id)}>
      {isEditing ? (
        <Input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="h-8"
          onClick={(e) => e.stopPropagation()} // Prevent li onClick when editing
        />
      ) : (
        <span>{crop.name}</span>
      )}
      <div className="flex items-center gap-2">
        {isEditing ? (
          <Button size="icon" variant="ghost" className="h-8 w-8" onClick={(e) => { e.stopPropagation(); handleUpdate(); }} disabled={isUpdating}>
            {isUpdating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
          </Button>
        ) : (
          <Button size="icon" variant="ghost" className="h-8 w-8" onClick={(e) => { e.stopPropagation(); setIsEditing(true); }}>
            <Pencil className="h-4 w-4" />
          </Button>
        )}
        <Button size="icon" variant="ghost" className="h-8 w-8" onClick={(e) => { e.stopPropagation(); remove(); }} disabled={isDeleting}>
          {isDeleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash className="h-4 w-4" />}
        </Button>
      </div>
    </li>
  );
