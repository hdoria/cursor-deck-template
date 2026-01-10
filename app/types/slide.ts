export type SlideType = 'title' | 'content' | 'code' | 'quote' | 'diagram';

export interface Slide {
  id: string;
  title: string;
  content: string;
  type: SlideType;
  order: number;
  code?: string;
  language?: string;
  quote?: string;
  author?: string;
  diagram?: string;
}

export interface PresentationTheme {
  primaryColor: string;
  headingFont: string;
  bodyFont: string;
}

export const THEME_COLORS = [
  { name: 'Laranja', value: '24 95% 53%' },
  { name: 'Azul', value: '221 83% 53%' },
  { name: 'Verde', value: '142 71% 45%' },
  { name: 'Roxo', value: '262 83% 58%' },
  { name: 'Rosa', value: '330 81% 60%' },
  { name: 'Vermelho', value: '0 72% 51%' },
  { name: 'Amarelo', value: '45 93% 47%' },
  { name: 'Ciano', value: '186 94% 42%' },
] as const;

export const HEADING_FONTS = [
  { name: 'Cal Sans', value: 'Cal Sans, sans-serif' },
  { name: 'Inter', value: 'Inter, sans-serif' },
  { name: 'Playfair Display', value: 'Playfair Display, serif' },
  { name: 'Montserrat', value: 'Montserrat, sans-serif' },
  { name: 'Roboto Slab', value: 'Roboto Slab, serif' },
  { name: 'Poppins', value: 'Poppins, sans-serif' },
  { name: 'Oswald', value: 'Oswald, sans-serif' },
] as const;

export const BODY_FONTS = [
  { name: 'Inter', value: 'Inter, sans-serif' },
  { name: 'Lora', value: 'Lora, serif' },
  { name: 'Open Sans', value: 'Open Sans, sans-serif' },
  { name: 'Roboto', value: 'Roboto, sans-serif' },
  { name: 'Source Sans 3', value: 'Source Sans 3, sans-serif' },
  { name: 'Merriweather', value: 'Merriweather, serif' },
] as const;

export const DEFAULT_THEME: PresentationTheme = {
  primaryColor: '24 95% 53%',
  headingFont: 'Inter, sans-serif',
  bodyFont: 'Inter, sans-serif',
};

export interface Presentation {
  id: string;
  name: string;
  slides: Slide[];
  theme: PresentationTheme;
  createdAt: Date;
  updatedAt: Date;
}
