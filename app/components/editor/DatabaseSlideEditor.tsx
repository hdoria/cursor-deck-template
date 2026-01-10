import { useState, useEffect, useCallback, useRef } from 'react';
import { Slide, SlideType, PresentationTheme } from '@/types/slide';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { SlideRenderer } from '@/components/slides/SlideRenderer';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable';

const SLIDE_TYPES: { value: SlideType; label: string }[] = [
  { value: 'title', label: 'Título' },
  { value: 'content', label: 'Conteúdo' },
  { value: 'code', label: 'Código' },
  { value: 'quote', label: 'Citação' },
  { value: 'diagram', label: 'Diagrama' },
];

const LANGUAGES = [
  { value: 'javascript', label: 'JavaScript' },
  { value: 'typescript', label: 'TypeScript' },
  { value: 'python', label: 'Python' },
  { value: 'java', label: 'Java' },
  { value: 'csharp', label: 'C#' },
  { value: 'go', label: 'Go' },
  { value: 'rust', label: 'Rust' },
  { value: 'sql', label: 'SQL' },
  { value: 'bash', label: 'Bash' },
  { value: 'html', label: 'HTML' },
  { value: 'css', label: 'CSS' },
];

interface DatabaseSlideEditorProps {
  slide: Slide;
  theme: PresentationTheme;
  onUpdate: (updates: Partial<Slide>) => void;
}

export function DatabaseSlideEditor({ slide, theme, onUpdate }: DatabaseSlideEditorProps) {
  // Local state for immediate UI updates
  const [localSlide, setLocalSlide] = useState<Slide>(slide);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Sync local state when slide prop changes (e.g., switching slides)
  useEffect(() => {
    setLocalSlide(slide);
  }, [slide.id]); // Only reset when slide ID changes

  // Debounced save function
  const debouncedSave = useCallback(
    (updates: Partial<Slide>) => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
      debounceTimerRef.current = setTimeout(() => {
        onUpdate(updates);
      }, 500); // 500ms debounce
    },
    [onUpdate]
  );

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  // Handle local change with debounced save
  const handleChange = (updates: Partial<Slide>) => {
    const newSlide = { ...localSlide, ...updates };
    setLocalSlide(newSlide);
    debouncedSave(updates);
  };

  // Handle immediate save (for selects)
  const handleImmediateChange = (updates: Partial<Slide>) => {
    const newSlide = { ...localSlide, ...updates };
    setLocalSlide(newSlide);
    onUpdate(updates);
  };

  const renderTypeFields = () => {
    switch (localSlide.type) {
      case 'code':
        return (
          <>
            <div className="space-y-2">
              <Label htmlFor="language">Linguagem</Label>
              <Select
                value={localSlide.language || 'javascript'}
                onValueChange={(value) => handleImmediateChange({ language: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {LANGUAGES.map((lang) => (
                    <SelectItem key={lang.value} value={lang.value}>
                      {lang.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="code">Código</Label>
              <Textarea
                id="code"
                value={localSlide.code || ''}
                onChange={(e) => handleChange({ code: e.target.value })}
                placeholder="Digite o código aqui..."
                className="font-mono min-h-[200px]"
              />
            </div>
          </>
        );

      case 'quote':
        return (
          <>
            <div className="space-y-2">
              <Label htmlFor="quote">Citação</Label>
              <Textarea
                id="quote"
                value={localSlide.quote || ''}
                onChange={(e) => handleChange({ quote: e.target.value })}
                placeholder="Digite a citação..."
                className="min-h-[100px]"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="author">Autor</Label>
              <Input
                id="author"
                value={localSlide.author || ''}
                onChange={(e) => handleChange({ author: e.target.value })}
                placeholder="Nome do autor"
              />
            </div>
          </>
        );

      case 'diagram':
        return (
          <div className="space-y-2">
            <Label htmlFor="diagram">Diagrama (Mermaid)</Label>
            <Textarea
              id="diagram"
              value={localSlide.diagram || ''}
              onChange={(e) => handleChange({ diagram: e.target.value })}
              placeholder={`graph TD\n  A[Início] --> B[Fim]`}
              className="font-mono min-h-[200px]"
            />
          </div>
        );

      default:
        return (
          <div className="space-y-2">
            <Label htmlFor="content">Conteúdo (Markdown)</Label>
            <Textarea
              id="content"
              value={localSlide.content || ''}
              onChange={(e) => handleChange({ content: e.target.value })}
              placeholder="Digite o conteúdo em Markdown..."
              className="min-h-[200px]"
            />
          </div>
        );
    }
  };

  return (
    <ResizablePanelGroup direction="horizontal" className="h-full">
      {/* Editor Panel */}
      <ResizablePanel defaultSize={40} minSize={30}>
        <div className="p-4 h-full overflow-y-auto">
          <div className="space-y-4 max-w-lg">
            <div className="space-y-2">
              <Label htmlFor="title">Título</Label>
              <Input
                id="title"
                value={localSlide.title}
                onChange={(e) => handleChange({ title: e.target.value })}
                placeholder="Título do slide"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">Tipo</Label>
              <Select
                value={localSlide.type}
                onValueChange={(value) => handleImmediateChange({ type: value as SlideType })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {SLIDE_TYPES.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {renderTypeFields()}
          </div>
        </div>
      </ResizablePanel>

      <ResizableHandle withHandle />

      {/* Preview Panel */}
      <ResizablePanel defaultSize={60} minSize={40}>
        <div className="h-full p-4 bg-muted/30">
          <div className="h-full rounded-lg overflow-hidden shadow-lg">
            <SlideRenderer slide={localSlide} theme={theme} />
          </div>
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}
