import { Slide } from '@/app/types/slide';

export const sampleSlides: Slide[] = [
  {
    id: '1',
    title: 'Slide Presentation Template',
    content: `Um template moderno para apresentações

**Desenvolvido com React + TypeScript**

Navegue com as setas ← → ou clique na barra de progresso`,
    type: 'title',
    order: 0,
  },
  {
    id: '2',
    title: 'O que você vai aprender',
    content: `## Agenda

- Tipos de slides disponíveis
- Como usar Markdown
- Syntax highlighting para código
- Navegação e atalhos
- Personalização do tema`,
    type: 'content',
    order: 1,
  },
  {
    id: '3',
    title: 'Exemplo de Código',
    content: `## TypeScript com Syntax Highlighting

\`\`\`typescript
interface User {
  id: string;
  name: string;
  email: string;
}

function greetUser(user: User): string {
  return \`Olá, \${user.name}!\`;
}

const user: User = {
  id: '1',
  name: 'João',
  email: 'joao@email.com'
};

console.log(greetUser(user));
\`\`\``,
    type: 'code',
    order: 2,
  },
  {
    id: '4',
    title: 'Uma Citação Inspiradora',
    content: `## O Poder da Simplicidade

> "Simplicidade é a sofisticação suprema."
> 
> — Leonardo da Vinci

A melhor apresentação é aquela que comunica sua mensagem de forma clara e memorável.`,
    type: 'quote',
    order: 3,
  },
  {
    id: '5',
    title: 'Arquitetura do Sistema',
    content: `## Visão Geral da Arquitetura

\`\`\`
┌─────────────────────────────────────────┐
│              Frontend (React)            │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐  │
│  │ Viewer  │  │ Editor  │  │ Themes  │  │
│  └────┬────┘  └────┬────┘  └────┬────┘  │
│       │            │            │        │
│       └────────────┴────────────┘        │
│                    │                     │
└────────────────────┼─────────────────────┘
                     │
         ┌───────────▼───────────┐
         │    State Management   │
         │    (React Context)    │
         └───────────┬───────────┘
                     │
         ┌───────────▼───────────┐
         │   Backend (Supabase)  │
         │  ┌─────┐  ┌────────┐  │
         │  │ DB  │  │ Auth   │  │
         │  └─────┘  └────────┘  │
         └───────────────────────┘
\`\`\``,
    type: 'diagram',
    order: 4,
  },
  {
    id: '6',
    title: 'Recursos Disponíveis',
    content: `## Markdown Completo

| Recurso | Sintaxe | Exemplo |
|---------|---------|---------|
| **Negrito** | \`**texto**\` | **texto** |
| *Itálico* | \`*texto*\` | *texto* |
| Código | \`\\\`código\\\`\` | \`código\` |
| Link | \`[texto](url)\` | [Link](https://exemplo.com) |

### Listas

- Item com bullet point
- Outro item
  - Sub-item aninhado

1. Item numerado
2. Segundo item
3. Terceiro item`,
    type: 'content',
    order: 5,
  },
  {
    id: '7',
    title: 'Atalhos de Teclado',
    content: `## Navegação Rápida

| Tecla | Ação |
|-------|------|
| \`→\` ou \`Space\` | Próximo slide |
| \`←\` | Slide anterior |
| \`Home\` | Primeiro slide |
| \`End\` | Último slide |
| \`F\` | Tela cheia |
| \`Esc\` | Sair da tela cheia |

**Dica:** Clique em qualquer ponto da barra de progresso para ir diretamente a um slide específico.`,
    type: 'content',
    order: 6,
  },
  {
    id: '8',
    title: 'Obrigado!',
    content: `Agora é sua vez de criar

**Clique em "Editar" para começar**

Crie apresentações incríveis! 🚀`,
    type: 'title',
    order: 7,
  },
];
