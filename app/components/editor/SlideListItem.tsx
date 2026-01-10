"use client";

import { Copy, Trash2, GripVertical, FileText, Code, Quote, LayoutGrid, Type } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/app/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { Slide, SlideType } from '@/app/types/slide';
import { useEditor } from '@/app/contexts/EditorContext';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const typeIcons: Record<SlideType, React.ElementType> = {
  title: Type,
  content: FileText,
  code: Code,
  quote: Quote,
  diagram: LayoutGrid,
};

interface SlideListItemProps {
  slide: Slide;
  index: number;
  isCollapsed?: boolean;
}

export function SlideListItem({ slide, index, isCollapsed = false }: SlideListItemProps) {
  const { selectedSlideId, setSelectedSlideId, deleteSlide, duplicateSlide, slides } = useEditor();
  const isSelected = selectedSlideId === slide.id;
  const Icon = typeIcons[slide.type];
  const canDelete = slides.length > 1;

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ 
    id: slide.id,
    transition: {
      duration: 200,
      easing: 'ease',
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };

  const content = (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        'group flex items-center gap-2 rounded-lg border p-2 cursor-pointer transition-all',
        isSelected
          ? 'border-accent bg-accent/10'
          : 'border-transparent hover:border-border hover:bg-muted/50',
        isDragging && 'opacity-50 shadow-lg z-50',
        isCollapsed && 'justify-center p-1.5'
      )}
      onClick={() => setSelectedSlideId(slide.id)}
    >
      {!isCollapsed && (
        <div
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <GripVertical className="h-4 w-4" />
        </div>
      )}

      <div className={cn(
        "flex shrink-0 items-center justify-center rounded bg-muted text-xs font-medium",
        isCollapsed ? "h-6 w-6" : "h-8 w-8"
      )}>
        {index + 1}
      </div>

      {!isCollapsed && (
        <>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <Icon className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
              <span className="text-sm font-medium truncate">{slide.title}</span>
            </div>
            <span className="text-xs text-muted-foreground capitalize">{slide.type}</span>
          </div>

          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={(e) => {
                e.stopPropagation();
                duplicateSlide(slide.id);
              }}
              title="Duplicar slide"
            >
              <Copy className="h-3.5 w-3.5" />
            </Button>
            {canDelete && (
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-destructive hover:text-destructive"
                onClick={(e) => {
                  e.stopPropagation();
                  deleteSlide(slide.id);
                }}
                title="Excluir slide"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            )}
          </div>
        </>
      )}
    </div>
  );

  if (isCollapsed) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>{content}</TooltipTrigger>
        <TooltipContent side="right">
          <p className="font-medium">{slide.title}</p>
          <p className="text-xs text-muted-foreground capitalize">{slide.type}</p>
        </TooltipContent>
      </Tooltip>
    );
  }

  return content;
}
