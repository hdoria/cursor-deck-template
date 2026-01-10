"use client";

import { Plus, FileText, Code, Quote, LayoutGrid, Type } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/app/components/ui/dropdown-menu';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/app/components/ui/tooltip';
import { SlideType } from '@/app/types/slide';
import { useEditor } from '@/app/contexts/EditorContext';

const slideTypes: { type: SlideType; label: string; icon: React.ElementType; description: string }[] = [
  { type: 'title', label: 'Título', icon: Type, description: 'Slide de título centralizado' },
  { type: 'content', label: 'Conteúdo', icon: FileText, description: 'Slide com texto e listas' },
  { type: 'code', label: 'Código', icon: Code, description: 'Slide otimizado para código' },
  { type: 'quote', label: 'Citação', icon: Quote, description: 'Slide com citação destacada' },
  { type: 'diagram', label: 'Diagrama', icon: LayoutGrid, description: 'Slide para diagramas ASCII' },
];

interface AddSlideButtonProps {
  isCollapsed?: boolean;
}

export function AddSlideButton({ isCollapsed = false }: AddSlideButtonProps) {
  const { addSlide } = useEditor();

  const button = (
    <DropdownMenuTrigger asChild>
      <Button variant="outline" size={isCollapsed ? 'icon' : 'sm'} className={isCollapsed ? 'h-8 w-8' : 'w-full gap-2'}>
        <Plus className="h-4 w-4" />
        {!isCollapsed && <span>Adicionar Slide</span>}
      </Button>
    </DropdownMenuTrigger>
  );

  return (
    <DropdownMenu>
      {isCollapsed ? (
        <Tooltip>
          <TooltipTrigger asChild>{button}</TooltipTrigger>
          <TooltipContent side="right">Adicionar Slide</TooltipContent>
        </Tooltip>
      ) : (
        button
      )}
      <DropdownMenuContent align="start" className="w-56">
        {slideTypes.map(({ type, label, icon: Icon, description }) => (
          <DropdownMenuItem
            key={type}
            onClick={() => addSlide(type)}
            className="flex flex-col items-start gap-1 py-2"
          >
            <div className="flex items-center gap-2">
              <Icon className="h-4 w-4" />
              <span className="font-medium">{label}</span>
            </div>
            <span className="text-xs text-muted-foreground">{description}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
