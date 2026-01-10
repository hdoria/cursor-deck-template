"use client";

import { FileText, Code, Quote, LayoutGrid, Type } from 'lucide-react';
import { Label } from '@/app/components/ui/label';
import { cn } from '@/lib/utils';
import { SlideType } from '@/app/types/slide';
import { useEditor } from '@/app/contexts/EditorContext';

const slideTypes: { type: SlideType; label: string; icon: React.ElementType }[] = [
  { type: 'title', label: 'Título', icon: Type },
  { type: 'content', label: 'Conteúdo', icon: FileText },
  { type: 'code', label: 'Código', icon: Code },
  { type: 'quote', label: 'Citação', icon: Quote },
  { type: 'diagram', label: 'Diagrama', icon: LayoutGrid },
];

export function SlideTypeSelector() {
  const { selectedSlide, updateSlide } = useEditor();

  if (!selectedSlide) return null;

  return (
    <div className="space-y-2">
      <Label className="text-xs text-muted-foreground uppercase tracking-wide">
        Tipo de Slide
      </Label>
      <div className="flex flex-wrap gap-2">
        {slideTypes.map(({ type, label, icon: Icon }) => (
          <button
            key={type}
            onClick={() => updateSlide(selectedSlide.id, { type })}
            className={cn(
              'flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm transition-all',
              'border hover:bg-muted/50',
              selectedSlide.type === type
                ? 'border-accent bg-accent/10 text-accent'
                : 'border-border text-muted-foreground'
            )}
          >
            <Icon className="h-4 w-4" />
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}
