"use client";

import { useEditor } from '@/app/contexts/EditorContext';
import { SlideListItem } from './SlideListItem';
import { AddSlideButton } from './AddSlideButton';
import { ScrollArea } from '@/app/components/ui/scroll-area';
import { useSidebar } from '@/app/components/ui/sidebar';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { useState } from 'react';
import { Slide } from '@/app/types/slide';

export function SlideList() {
  const { slides, reorderSlides } = useEditor();
  const { state } = useSidebar();
  const isCollapsed = state === 'collapsed';
  const sortedSlides = [...slides].sort((a, b) => a.order - b.order);
  const [activeSlide, setActiveSlide] = useState<Slide | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    const slide = sortedSlides.find((s) => s.id === event.active.id);
    setActiveSlide(slide || null);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveSlide(null);

    if (over && active.id !== over.id) {
      const oldIndex = sortedSlides.findIndex((s) => s.id === active.id);
      const newIndex = sortedSlides.findIndex((s) => s.id === over.id);
      reorderSlides(oldIndex, newIndex);
    }
  };

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <div className="p-3 border-b">
        <AddSlideButton isCollapsed={isCollapsed} />
      </div>
      
      <ScrollArea className="flex-1">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={sortedSlides.map((s) => s.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="flex flex-col gap-1 p-3">
              {sortedSlides.map((slide, index) => (
                <SlideListItem key={slide.id} slide={slide} index={index} isCollapsed={isCollapsed} />
              ))}
            </div>
          </SortableContext>
          <DragOverlay>
            {activeSlide ? (
              <div className="rounded-lg border border-accent bg-background p-2 shadow-lg opacity-90">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded bg-muted text-xs font-medium">
                    {sortedSlides.findIndex((s) => s.id === activeSlide.id) + 1}
                  </div>
                  <span className="text-sm font-medium truncate">{activeSlide.title}</span>
                </div>
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>
      </ScrollArea>
    </div>
  );
}