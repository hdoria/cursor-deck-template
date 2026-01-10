"use client";

import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Textarea } from '@/app/components/ui/textarea';
import { SlideTypeSelector } from './SlideTypeSelector';
import { useEditor } from '@/app/contexts/EditorContext';
import { ScrollArea } from '@/app/components/ui/scroll-area';
import { MarkdownRenderer } from '@/components/MarkdownRenderer';

export function SlideEditor() {
  const { selectedSlide, updateSlide } = useEditor();

  if (!selectedSlide) {
    return (
      <div className="flex h-full items-center justify-center text-muted-foreground">
        Selecione um slide para editar
      </div>
    );
  }

  return (
    <div className="flex h-full">
      {/* Editor Panel */}
      <div className="w-1/2 border-r flex flex-col">
        <div className="p-4 border-b">
          <h2 className="text-lg font-semibold">Editor</h2>
        </div>
        
        <ScrollArea className="flex-1">
          <div className="p-4 space-y-6">
            {/* Slide Type */}
            <SlideTypeSelector />

            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title" className="text-xs text-muted-foreground uppercase tracking-wide">
                Título
              </Label>
              <Input
                id="title"
                value={selectedSlide.title}
                onChange={(e) => updateSlide(selectedSlide.id, { title: e.target.value })}
                placeholder="Título do slide"
                className="text-lg font-medium"
              />
            </div>

            {/* Content */}
            <div className="space-y-2">
              <Label htmlFor="content" className="text-xs text-muted-foreground uppercase tracking-wide">
                Conteúdo (Markdown)
              </Label>
              <Textarea
                id="content"
                value={selectedSlide.content}
                onChange={(e) => updateSlide(selectedSlide.id, { content: e.target.value })}
                placeholder="Use Markdown para formatar o conteúdo..."
                className="min-h-[300px] font-mono text-sm resize-none"
              />
            </div>

            {/* Markdown help */}
            <div className="rounded-lg bg-muted/50 p-4 text-sm text-muted-foreground">
              <p className="font-medium mb-2">Dicas de Markdown:</p>
              <ul className="space-y-1 text-xs">
                <li><code className="bg-muted px-1 rounded">**texto**</code> → <strong>negrito</strong></li>
                <li><code className="bg-muted px-1 rounded">*texto*</code> → <em>itálico</em></li>
                <li><code className="bg-muted px-1 rounded">## Título</code> → Título H2</li>
                <li><code className="bg-muted px-1 rounded">- item</code> → Lista</li>
                <li><code className="bg-muted px-1 rounded">&gt; citação</code> → Blockquote</li>
                <li><code className="bg-muted px-1 rounded">```code```</code> → Bloco de código</li>
              </ul>
            </div>
          </div>
        </ScrollArea>
      </div>

      {/* Preview Panel */}
      <div className="w-1/2 flex flex-col bg-muted/30">
        <div className="p-4 border-b">
          <h2 className="text-lg font-semibold">Preview</h2>
        </div>
        
        <div className="flex-1 p-4 overflow-auto">
          <div className="rounded-lg border bg-background shadow-sm p-6">
            <h1 className="text-2xl font-bold mb-4">{selectedSlide.title}</h1>
            <div className="prose prose-invert max-w-none">
              <MarkdownRenderer content={selectedSlide.content} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
