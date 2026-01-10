"use client";

import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Slide, SlideType, PresentationTheme, DEFAULT_THEME } from '@/app/types/slide';
import { sampleSlides } from '@/app/data/sampleSlides';

interface EditorContextType {
  slides: Slide[];
  selectedSlideId: string | null;
  selectedSlide: Slide | null;
  theme: PresentationTheme;
  setSelectedSlideId: (id: string | null) => void;
  addSlide: (type: SlideType) => void;
  updateSlide: (id: string, updates: Partial<Slide>) => void;
  deleteSlide: (id: string) => void;
  reorderSlides: (startIndex: number, endIndex: number) => void;
  duplicateSlide: (id: string) => void;
  updateTheme: (updates: Partial<PresentationTheme>) => void;
}

const EditorContext = createContext<EditorContextType | undefined>(undefined);

export function EditorProvider({ children }: { children: ReactNode }) {
  const [slides, setSlides] = useState<Slide[]>(sampleSlides);
  const [selectedSlideId, setSelectedSlideId] = useState<string | null>(
    sampleSlides[0]?.id || null
  );
  const [theme, setTheme] = useState<PresentationTheme>(DEFAULT_THEME);

  // Apply theme CSS variables
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--presentation-primary', theme.primaryColor);
    root.style.setProperty('--presentation-heading-font', theme.headingFont);
    root.style.setProperty('--presentation-body-font', theme.bodyFont);
    root.style.setProperty('--accent', theme.primaryColor);
    root.style.setProperty('--ring', theme.primaryColor);
    root.style.setProperty('--sidebar-ring', theme.primaryColor);
  }, [theme]);

  const selectedSlide = slides.find((s) => s.id === selectedSlideId) || null;

  const addSlide = (type: SlideType) => {
    const maxOrder = Math.max(...slides.map((s) => s.order), -1);
    const newSlide: Slide = {
      id: crypto.randomUUID(),
      title: 'Novo Slide',
      content: '',
      type,
      order: maxOrder + 1,
    };
    setSlides((prev) => [...prev, newSlide]);
    setSelectedSlideId(newSlide.id);
  };

  const updateSlide = (id: string, updates: Partial<Slide>) => {
    setSlides((prev) =>
      prev.map((slide) =>
        slide.id === id ? { ...slide, ...updates } : slide
      )
    );
  };

  const deleteSlide = (id: string) => {
    if (slides.length <= 1) return;
    
    setSlides((prev) => prev.filter((s) => s.id !== id));
    
    if (selectedSlideId === id) {
      const sortedSlides = [...slides].sort((a, b) => a.order - b.order);
      const currentIndex = sortedSlides.findIndex((s) => s.id === id);
      const nextSlide = sortedSlides[currentIndex + 1] || sortedSlides[currentIndex - 1];
      setSelectedSlideId(nextSlide?.id || null);
    }
  };

  const reorderSlides = (startIndex: number, endIndex: number) => {
    const sortedSlides = [...slides].sort((a, b) => a.order - b.order);
    const [removed] = sortedSlides.splice(startIndex, 1);
    sortedSlides.splice(endIndex, 0, removed);
    
    const updatedSlides = sortedSlides.map((slide, index) => ({
      ...slide,
      order: index,
    }));
    
    setSlides(updatedSlides);
  };

  const duplicateSlide = (id: string) => {
    const slideToClone = slides.find((s) => s.id === id);
    if (!slideToClone) return;
    
    const maxOrder = Math.max(...slides.map((s) => s.order));
    const newSlide: Slide = {
      ...slideToClone,
      id: crypto.randomUUID(),
      title: `${slideToClone.title} (cópia)`,
      order: maxOrder + 1,
    };
    setSlides((prev) => [...prev, newSlide]);
    setSelectedSlideId(newSlide.id);
  };

  const updateTheme = (updates: Partial<PresentationTheme>) => {
    setTheme((prev) => ({ ...prev, ...updates }));
  };

  return (
    <EditorContext.Provider
      value={{
        slides,
        selectedSlideId,
        selectedSlide,
        theme,
        setSelectedSlideId,
        addSlide,
        updateSlide,
        deleteSlide,
        reorderSlides,
        duplicateSlide,
        updateTheme,
      }}
    >
      {children}
    </EditorContext.Provider>
  );
}

export function useEditor() {
  const context = useContext(EditorContext);
  if (!context) {
    throw new Error('useEditor must be used within an EditorProvider');
  }
  return context;
}
