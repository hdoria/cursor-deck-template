"use client";

import { useState } from 'react';
import { Palette } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/app/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/app/components/ui/select';
import { Label } from '@/app/components/ui/label';
import { useEditor } from '@/app/contexts/EditorContext';
import { THEME_COLORS, HEADING_FONTS, BODY_FONTS } from '@/app/types/slide';
import { cn } from '@/lib/utils';

function hexToHsl(hex: string): string {
  // Remove # if present
  hex = hex.replace(/^#/, '');
  
  const r = parseInt(hex.slice(0, 2), 16) / 255;
  const g = parseInt(hex.slice(2, 4), 16) / 255;
  const b = parseInt(hex.slice(4, 6), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    
    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
        break;
      case g:
        h = ((b - r) / d + 2) / 6;
        break;
      case b:
        h = ((r - g) / d + 4) / 6;
        break;
    }
  }

  return `${Math.round(h * 360)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`;
}

function hslToHex(hsl: string): string {
  const parts = hsl.match(/(\d+)\s+(\d+)%?\s+(\d+)%?/);
  if (!parts) return '#ff6b00';
  
  const h = parseInt(parts[1]) / 360;
  const s = parseInt(parts[2]) / 100;
  const l = parseInt(parts[3]) / 100;

  const hue2rgb = (p: number, q: number, t: number) => {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1/6) return p + (q - p) * 6 * t;
    if (t < 1/2) return q;
    if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
    return p;
  };

  let r, g, b;
  if (s === 0) {
    r = g = b = l;
  } else {
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1/3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1/3);
  }

  const toHex = (x: number) => {
    const hex = Math.round(x * 255).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };

  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

export function ThemeCustomizer() {
  const { theme, updateTheme } = useEditor();
  const [customColor, setCustomColor] = useState(() => hslToHex(theme.primaryColor));

  const handleCustomColorChange = (hex: string) => {
    setCustomColor(hex);
    const hsl = hexToHsl(hex);
    updateTheme({ primaryColor: hsl });
  };

  const isCustomColor = !THEME_COLORS.some(c => c.value === theme.primaryColor);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Palette className="h-4 w-4" />
          Tema
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80" align="end">
        <div className="space-y-4">
          <div className="space-y-2">
            <h4 className="font-medium leading-none">Personalizar Tema</h4>
            <p className="text-sm text-muted-foreground">
              Escolha as cores e fontes da apresentação.
            </p>
          </div>

          {/* Color Picker */}
          <div className="space-y-2">
            <Label>Cor Primária</Label>
            <div className="grid grid-cols-5 gap-2">
              {THEME_COLORS.map((color) => (
                <button
                  key={color.value}
                  onClick={() => updateTheme({ primaryColor: color.value })}
                  className={cn(
                    'h-8 w-full rounded-md transition-all hover:scale-105',
                    theme.primaryColor === color.value && 'ring-2 ring-offset-2 ring-offset-background'
                  )}
                  style={{ backgroundColor: `hsl(${color.value})` }}
                  title={color.name}
                />
              ))}
              {/* Custom color picker */}
              <div className="relative">
                <input
                  type="color"
                  value={customColor}
                  onChange={(e) => handleCustomColorChange(e.target.value)}
                  className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                  title="Cor customizada"
                />
                <div
                  className={cn(
                    'h-8 w-full rounded-md transition-all flex items-center justify-center border-2 border-dashed border-muted-foreground/30 hover:border-muted-foreground/50',
                    isCustomColor && 'ring-2 ring-offset-2 ring-offset-background border-solid'
                  )}
                  style={{ backgroundColor: isCustomColor ? `hsl(${theme.primaryColor})` : 'transparent' }}
                >
                  {!isCustomColor && <span className="text-xs text-muted-foreground">+</span>}
                </div>
              </div>
            </div>
          </div>

          {/* Heading Font */}
          <div className="space-y-2">
            <Label>Fonte dos Títulos</Label>
            <Select
              value={theme.headingFont}
              onValueChange={(value) => updateTheme({ headingFont: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {HEADING_FONTS.map((font) => (
                  <SelectItem
                    key={font.value}
                    value={font.value}
                    style={{ fontFamily: font.value }}
                  >
                    {font.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Body Font */}
          <div className="space-y-2">
            <Label>Fonte do Texto</Label>
            <Select
              value={theme.bodyFont}
              onValueChange={(value) => updateTheme({ bodyFont: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {BODY_FONTS.map((font) => (
                  <SelectItem
                    key={font.value}
                    value={font.value}
                    style={{ fontFamily: font.value }}
                  >
                    {font.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
