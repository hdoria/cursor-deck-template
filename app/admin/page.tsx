"use client";

import Link from 'next/link';
import { Play } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarProvider,
  SidebarTrigger,
} from '@/app/components/ui/sidebar';
import { SlideList } from '@/app/components/editor/SlideList';
import { SlideEditor } from '@/app/components/editor/SlideEditor';
import { ThemeCustomizer } from '@/app/components/editor/ThemeCustomizer';
import { TooltipProvider } from '@/app/components/ui/tooltip';

export default function AdminPage() {
  return (
    <TooltipProvider>
      <SidebarProvider defaultOpen={true}>
        <div className="flex min-h-screen w-full">
          {/* Sidebar with slide list */}
          <Sidebar collapsible="icon" className="border-r">
            <SidebarHeader className="h-14 border-b px-3 flex items-center justify-center">
              <h1 className="text-lg font-bold group-data-[collapsible=icon]:hidden">
                Slides
              </h1>
            </SidebarHeader>
            <SidebarContent className="p-0">
              <SlideList />
            </SidebarContent>
          </Sidebar>

          {/* Main content */}
          <div className="flex flex-1 flex-col">
            {/* Header */}
            <header className="flex h-14 items-center justify-between border-b px-4">
              <div className="flex items-center gap-2">
                <SidebarTrigger />
                <span className="text-sm text-muted-foreground">Editor de Apresentação</span>
              </div>
              <div className="flex items-center gap-2">
                <ThemeCustomizer />
                <Button asChild variant="default" size="sm" className="gap-2">
                  <Link href="/slides/1">
                    <Play className="h-4 w-4" />
                    Apresentar
                  </Link>
                </Button>
              </div>
            </header>

            {/* Editor content */}
            <main className="flex-1 overflow-hidden">
              <SlideEditor />
            </main>
          </div>
        </div>
      </SidebarProvider>
    </TooltipProvider>
  );
}
