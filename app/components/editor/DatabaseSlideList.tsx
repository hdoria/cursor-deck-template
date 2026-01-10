import { Slide, SlideType } from '@/types/slide';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Plus,
  MoreVertical,
  Trash2,
  Copy,
  Layout,
  FileText,
  Code,
  Quote,
  GitBranch,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useSidebar } from '@/components/ui/sidebar';

const SLIDE_TYPES: { type: SlideType; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { type: 'title', label: 'Título', icon: Layout },
  { type: 'content', label: 'Conteúdo', icon: FileText },
  { type: 'code', label: 'Código', icon: Code },
  { type: 'quote', label: 'Citação', icon: Quote },
  { type: 'diagram', label: 'Diagrama', icon: GitBranch },
];

interface DatabaseSlideListProps {
  slides: Slide[];
  selectedSlideId: string | null;
  onSelectSlide: (id: string) => void;
  onAddSlide: (type: SlideType) => void;
  onDeleteSlide: (id: string) => void;
  onDuplicateSlide: (id: string) => void;
  onReorderSlides: (startIndex: number, endIndex: number) => void;
}

export function DatabaseSlideList({
  slides,
  selectedSlideId,
  onSelectSlide,
  onAddSlide,
  onDeleteSlide,
  onDuplicateSlide,
}: DatabaseSlideListProps) {
  const { state } = useSidebar();
  const isCollapsed = state === 'collapsed';
  const sortedSlides = [...slides].sort((a, b) => a.order - b.order);

  return (
    <div className="flex flex-col h-full">
      <ScrollArea className="flex-1">
        <div className="p-2 space-y-2">
          {sortedSlides.map((slide, index) => {
            const TypeIcon = SLIDE_TYPES.find((t) => t.type === slide.type)?.icon || FileText;

            return (
              <div
                key={slide.id}
                className={cn(
                  'group relative rounded-lg border cursor-pointer transition-colors',
                  isCollapsed ? 'p-2 flex items-center justify-center' : 'p-3',
                  selectedSlideId === slide.id
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-primary/50'
                )}
                onClick={() => onSelectSlide(slide.id)}
                title={isCollapsed ? `${index + 1}. ${slide.title}` : undefined}
              >
                {isCollapsed ? (
                  <span className="text-xs font-medium">{index + 1}</span>
                ) : (
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground w-5">{index + 1}</span>
                    <TypeIcon className="h-4 w-4 text-muted-foreground shrink-0" />
                    <span className="text-sm truncate flex-1">{slide.title}</span>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 opacity-0 group-hover:opacity-100"
                        >
                          <MoreVertical className="h-3 w-3" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onDuplicateSlide(slide.id)}>
                          <Copy className="h-4 w-4 mr-2" />
                          Duplicar
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => onDeleteSlide(slide.id)}
                          className="text-destructive"
                          disabled={slides.length <= 1}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Excluir
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </ScrollArea>

      <div className="p-2 border-t">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className={cn("gap-2", isCollapsed ? "w-full p-2" : "w-full")}>
              <Plus className="h-4 w-4" />
              {!isCollapsed && <span>Novo Slide</span>}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="center" className="w-48">
            {SLIDE_TYPES.map(({ type, label, icon: Icon }) => (
              <DropdownMenuItem key={type} onClick={() => onAddSlide(type)}>
                <Icon className="h-4 w-4 mr-2" />
                {label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
