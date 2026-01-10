"use client";

import { notFound, useParams } from "next/navigation";
import { SlidePresenter } from "./SlidePresenter";
import { useEditor } from "@/app/contexts/EditorContext";

export default function SlidePage() {
  const params = useParams();
  const id = params.id as string;
  const slideId = parseInt(id, 10);
  const { slides } = useEditor();
  
  const sortedSlides = [...slides].sort((a, b) => a.order - b.order);
  const total = sortedSlides.length;
  const slideIndex = slideId - 1;
  const slide = sortedSlides[slideIndex];

  if (!slide || isNaN(slideId) || slideId < 1 || slideId > total) {
    notFound();
  }

  return (
    <SlidePresenter
      slide={slide}
      navigation={{
        current: slideId,
        total,
        hasNext: slideId < total,
        hasPrev: slideId > 1,
      }}
    />
  );
}
