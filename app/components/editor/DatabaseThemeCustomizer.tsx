import { useState } from 'react';
import { Settings, Palette } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  PresentationTheme,
  THEME_COLORS,
  HEADING_FONTS,
  BODY_FONTS,
} from '@/types/slide';
import { cn } from '@/lib/utils';

interface DatabaseThemeCustomizerProps {
  theme: PresentationTheme;
  onUpdate: (updates: Partial<PresentationTheme>) => void;
}

// Convert HSL string to hex for the color picker
function hslToHex(hsl: string): string {
  const parts = hsl.split(' ');
  if (parts.length !== 3) return '#3b82f6';

  const h = parseFloat(parts[0]) / 360;
  const s = parseFloat(parts[1]) / 100;
  const l = parseFloat(parts[2]) / 100;

  const hue2rgb = (p: number, q: number, t: number) => {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1 / 6) return p + (q - p) * 6 * t;
    if (t < 1 / 2) return q;
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
    return p;
  };

  let r, g, b;
  if (s === 0) {
    r = g = b = l;
  } else {
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }

  const toHex = (x: number) => {
    const hex = Math.round(x * 255).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };

  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

// Convert hex to HSL string
function hexToHsl(hex: string): string {
  hex = hex.replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16) / 255;
  const g = parseInt(hex.substring(2, 4), 16) / 255;
  const b = parseInt(hex.substring(4, 6), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0,
    s = 0;
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

export function DatabaseThemeCustomizer({ theme, onUpdate }: DatabaseThemeCustomizerProps) {
  const [customColor, setCustomColor] = useState(hslToHex(theme.primaryColor));

  const handleCustomColorChange = (hex: string) => {
    setCustomColor(hex);
    onUpdate({ primaryColor: hexToHsl(hex) });
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Settings className="h-4 w-4" />
          Tema
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80" align="end">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Palette className="h-4 w-4" />
              Cor Principal
            </Label>
            <div className="grid grid-cols-5 gap-2">
              {THEME_COLORS.map((color) => (
                <button
                  key={color.value}
                  className={cn(
                    'h-8 w-8 rounded-full border-2 transition-transform hover:scale-110',
                    theme.primaryColor === color.value
                      ? 'border-foreground ring-2 ring-offset-2 ring-offset-background'
                      : 'border-transparent'
                  )}
                  style={{ backgroundColor: `hsl(${color.value})` }}
                  onClick={() => {
                    onUpdate({ primaryColor: color.value });
                    setCustomColor(hslToHex(color.value));
                  }}
                  title={color.name}
                />
              ))}
              <div className="relative">
                <Input
                  type="color"
                  value={customColor}
                  onChange={(e) => handleCustomColorChange(e.target.value)}
                  className="h-8 w-8 p-0 border-2 rounded-full cursor-pointer overflow-hidden"
                  title="Cor customizada"
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Fonte dos Títulos</Label>
            <Select
              value={theme.headingFont}
              onValueChange={(value) => onUpdate({ headingFont: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {HEADING_FONTS.map((font) => (
                  <SelectItem key={font.value} value={font.value}>
                    <span style={{ fontFamily: font.value }}>{font.name}</span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Fonte do Corpo</Label>
            <Select
              value={theme.bodyFont}
              onValueChange={(value) => onUpdate({ bodyFont: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {BODY_FONTS.map((font) => (
                  <SelectItem key={font.value} value={font.value}>
                    <span style={{ fontFamily: font.value }}>{font.name}</span>
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
