# Landing Page V2 - Scrollytelling

Esta é a landing page narrativa (scrollytelling) da FlicAPP, localizada em `/landing-v2`.

## Estrutura

```
/app/(marketing)/landing-v2/
  ├── page.tsx              # Página principal que orquestra todas as seções
  ├── layout.tsx            # Layout com metadata e structured data
  ├── components/           # Componentes da landing page
  │   ├── Hero.tsx
  │   ├── PinnedPanels.tsx
  │   ├── ValueProps.tsx
  │   ├── StickyStepper.tsx
  │   ├── Trust.tsx
  │   ├── Testimonials.tsx
  │   ├── Pricing.tsx
  │   ├── CTAFinal.tsx
  │   ├── FAQ.tsx
  │   ├── ProgressBar.tsx
  │   ├── WhatsAppFloat.tsx
  │   ├── ScrollIndicator.tsx
  │   └── Footer.tsx
  ├── data/                 # Arquivos JSON com conteúdo
  │   ├── copy.json
  │   ├── faq.json
  │   ├── testimonials.json
  │   └── steps.json
  └── styles/
      └── animations.css    # Animações customizadas
```

## Como Editar Conteúdo

### Textos e Copy

Todo o conteúdo textual está em arquivos JSON na pasta `data/`:

- **`copy.json`**: Headlines, CTAs, descrições de valor, pricing
- **`faq.json`**: Perguntas e respostas do FAQ
- **`testimonials.json`**: Depoimentos de clientes/prestadores
- **`steps.json`**: Passos do processo (como funciona)

**Exemplo de edição:**

```json
// data/copy.json
{
  "hero": {
    "h1": "Seu novo headline aqui",
    "subheadline": "Sua subheadline aqui"
  }
}
```

### Métricas e Números

As métricas (avaliações, número de pedidos) estão em `data/copy.json`:

```json
{
  "trust": {
    "averageRating": 4.8,
    "totalOrders": 5000
  },
  "metrics": {
    "totalOrders": 5000,
    "averageRating": 4.8,
    "activeProviders": 850
  }
}
```

### FAQ

Para adicionar/remover perguntas, edite `data/faq.json`:

```json
{
  "id": "nova-pergunta",
  "question": "Sua pergunta?",
  "answer": "Sua resposta aqui."
}
```

## Como Substituir Assets

### Imagens de Mockups

1. Coloque as imagens em `public/landing-v2/images/mockups/`
2. Nomes esperados:
   - `step-1-request.png`
   - `step-2-proposals.png`
   - `step-3-chat.png`
   - `step-4-payment.png`
3. Descomente o código de Image no componente `StickyStepper.tsx`

### Backgrounds

1. Coloque em `public/landing-v2/images/backgrounds/`
2. Atualize os caminhos no componente `Hero.tsx` ou `PinnedPanels.tsx`

### Avatares de Depoimentos

1. Coloque em `public/landing-v2/images/testimonials/`
2. Nomes esperados: `cliente-1.jpg`, `prestador-1.jpg`, etc.
3. Os caminhos já estão configurados em `data/testimonials.json`

### Animações Lottie

1. Coloque os arquivos JSON em `public/landing-v2/lottie/`
2. Nomes esperados: `matching.json`, `chat.json`, `payment.json`
3. Atualize o componente `ValueProps.tsx` para usar Lottie (atualmente usa ícones Lucide)

## Ajustar Animações

### Timing de Animações

As animações usam Framer Motion. Para ajustar timing:

```tsx
// Exemplo em qualquer componente
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.6, delay: 0.2 }} // Ajuste aqui
>
```

### Parâmetros Padrão

- **Stagger**: 0.08s entre elementos
- **Duration**: 0.6s para fades
- **Spring**: `{ stiffness: 100, damping: 15 }`

### Desabilitar Animações (Reduced Motion)

As animações respeitam `prefers-reduced-motion` automaticamente. Para desabilitar manualmente, edite `styles/animations.css`.

## WhatsApp

O número do WhatsApp está configurado em:

- `components/WhatsAppFloat.tsx` (botão flutuante)
- `components/CTAFinal.tsx` (CTA final)

**Atualizar:** Procure por `WHATSAPP_NUMBER` e substitua `"5511999999999"` pelo número real.

## Analytics

Os eventos são rastreados via `lib/analytics.ts`. Para integrar com Google Tag Manager:

1. Adicione o script GTM no `layout.tsx` principal
2. Os eventos são enviados para `window.dataLayer`

Eventos rastreados:

- `page_view`
- `cta_click` (hero, final)
- `whatsapp_click`
- `step_view` (1-4)
- `faq_open`
- `pricing_toggle`

## SEO

### Metadata

Edite `layout.tsx` para atualizar:

- Title
- Description
- Open Graph tags
- Twitter cards

### Structured Data

O structured data (Schema.org) está em `layout.tsx`. Inclui:

- WebSite
- Organization
- Product
- FAQPage

Para adicionar mais FAQs ao structured data, edite o objeto `structuredData` em `layout.tsx`.

## Performance

### Otimizações Implementadas

- Dynamic imports para GSAP (carregado apenas quando necessário)
- Lazy loading de imagens com `next/image`
- Throttling de scroll listeners
- Animações desabilitadas fora do viewport

### Bundle Size

Target: ~150-200kB inicial JS. Para verificar:

```bash
npm run build
# Verifique o output para tamanhos de bundle
```

## Acessibilidade

- Contraste mínimo 4.5:1 (via design tokens)
- Navegação por teclado em todos os componentes
- ARIA labels em elementos interativos
- `prefers-reduced-motion` respeitado
- Hierarquia de headings correta (h1 → h6)

## Desenvolvimento

```bash
# Rodar em desenvolvimento
npm run dev

# Acessar a página
http://localhost:3000/landing-v2

# Build de produção
npm run build
npm start
```

## Troubleshooting

### GSAP não funciona

GSAP é carregado dinamicamente. Se houver problemas:

1. Verifique se `gsap` está instalado: `npm list gsap`
2. Verifique o console do navegador para erros
3. O pinning pode não funcionar em mobile - isso é esperado

### Animações não aparecem

1. Verifique se `animations.css` está importado no layout
2. Verifique o console para erros
3. Teste com `prefers-reduced-motion: no-preference` no DevTools

### Imagens não carregam

1. Verifique os caminhos em `public/landing-v2/`
2. Certifique-se de que os nomes dos arquivos correspondem aos esperados
3. Use `next/image` para otimização automática

## Próximos Passos

1. Substituir placeholders de imagens por assets reais
2. Adicionar animações Lottie (opcional)
3. Configurar Google Tag Manager
4. Atualizar número do WhatsApp
5. Testar em diferentes dispositivos e navegadores
6. Executar Lighthouse para verificar performance
