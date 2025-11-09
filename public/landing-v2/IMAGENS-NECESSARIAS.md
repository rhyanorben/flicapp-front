# 📸 Imagens Necessárias para Landing Page V2

Este documento lista todas as imagens que precisam ser adicionadas à landing page.

## 📁 Estrutura de Pastas

```
public/landing-v2/
├── images/
│   ├── mockups/          (4 imagens)
│   ├── testimonials/     (3 imagens)
│   └── backgrounds/      (4 imagens - opcional)
└── lottie/              (3 animações - opcional)
```

---

## 🖼️ 1. Mockups dos Passos (Obrigatório)

**Localização:** `public/landing-v2/images/mockups/`

Estas imagens aparecem na seção "Como funciona em 4 passos" (StickyStepper).

| Arquivo                | Descrição                                | Dimensões Recomendadas        |
| ---------------------- | ---------------------------------------- | ----------------------------- |
| `step-1-request.png`   | Mockup da tela de solicitação de serviço | 1080x1920px (9:16) ou similar |
| `step-2-proposals.png` | Mockup da tela de propostas recebidas    | 1080x1920px (9:16) ou similar |
| `step-3-chat.png`      | Mockup da tela de chat/conversa          | 1080x1920px (9:16) ou similar |
| `step-4-payment.png`   | Mockup da tela de pagamento              | 1080x1920px (9:16) ou similar |

**Nota:** Atualmente o código está usando placeholders. Para ativar as imagens, descomente o código em `StickyStepper.tsx` (linhas 155-161).

---

## 👤 2. Avatares de Depoimentos (Obrigatório)

**Localização:** `public/landing-v2/images/testimonials/`

Estas imagens aparecem na seção "Resultados reais" (Testimonials).

| Arquivo           | Pessoa      | Descrição                       |
| ----------------- | ----------- | ------------------------------- |
| `cliente-1.jpg`   | Maria Silva | Cliente de São Paulo, SP        |
| `prestador-1.jpg` | João Santos | Prestador do Rio de Janeiro, RJ |
| `cliente-2.jpg`   | Ana Costa   | Cliente de Belo Horizonte, MG   |

**Especificações:**

- Formato: JPG ou PNG
- Dimensões: 400x400px (quadrado, 1:1)
- Peso recomendado: < 100KB por imagem
- Estilo: Foto de perfil profissional ou avatar estilizado

**Nota:** Se as imagens não forem adicionadas, o componente Avatar mostrará as iniciais automaticamente (fallback).

---

## 🎨 3. Backgrounds (Opcional - Melhora Visual)

**Localização:** `public/landing-v2/images/backgrounds/`

Estas imagens podem ser usadas para melhorar o visual das seções.

| Arquivo            | Uso          | Descrição                                                              |
| ------------------ | ------------ | ---------------------------------------------------------------------- |
| `hero-bg.jpg`      | Hero Section | Background para a seção principal (opcional, atualmente usa gradiente) |
| `pain-point-1.jpg` | PinnedPanels | Background para pain point 1 (opcional)                                |
| `pain-point-2.jpg` | PinnedPanels | Background para pain point 2 (opcional)                                |
| `pain-point-3.jpg` | PinnedPanels | Background para pain point 3 (opcional)                                |

**Especificações:**

- Formato: JPG ou PNG
- Dimensões: 1920x1080px (16:9) ou maior
- Peso recomendado: < 300KB por imagem
- Estilo: Imagens sutis que não competem com o texto

**Nota:** Atualmente as seções usam cores sólidas/gradientes. Para usar backgrounds, será necessário atualizar os componentes.

---

## 🎬 4. Animações Lottie (Opcional - Melhora Visual)

**Localização:** `public/landing-v2/lottie/`

Estas animações podem substituir os ícones estáticos na seção "A virada: FlicAPP" (ValueProps).

| Arquivo         | Uso        | Descrição                            |
| --------------- | ---------- | ------------------------------------ |
| `matching.json` | ValueProps | Animação para "Matching Inteligente" |
| `chat.json`     | ValueProps | Animação para "Chat + WhatsApp"      |
| `payment.json`  | ValueProps | Animação para "Pagamento Seguro"     |

**Nota:** Atualmente o componente usa ícones Lucide React. Para usar Lottie, será necessário:

1. Instalar `lottie-react` (já instalado)
2. Atualizar `ValueProps.tsx` para usar `<Lottie>` ao invés de ícones

---

## ✅ Checklist de Implementação

### Prioridade Alta (Obrigatório)

- [ ] `step-1-request.png` - Mockup passo 1
- [ ] `step-2-proposals.png` - Mockup passo 2
- [ ] `step-3-chat.png` - Mockup passo 3
- [ ] `step-4-payment.png` - Mockup passo 4
- [ ] `cliente-1.jpg` - Avatar Maria Silva
- [ ] `prestador-1.jpg` - Avatar João Santos
- [ ] `cliente-2.jpg` - Avatar Ana Costa

### Prioridade Média (Recomendado)

- [ ] `hero-bg.jpg` - Background hero (opcional)
- [ ] Backgrounds para pain points (opcional)

### Prioridade Baixa (Opcional)

- [ ] Animações Lottie (opcional, ícones já funcionam)

---

## 🔧 Como Adicionar as Imagens

1. **Mockups:**

   - Crie screenshots/mockups das telas do app
   - Salve em `public/landing-v2/images/mockups/`
   - Descomente o código em `StickyStepper.tsx` (linhas 155-161)

2. **Avatares:**

   - Use fotos reais (com permissão) ou avatares estilizados
   - Salve em `public/landing-v2/images/testimonials/`
   - As imagens já estão configuradas e funcionarão automaticamente

3. **Backgrounds (se desejar):**

   - Adicione em `public/landing-v2/images/backgrounds/`
   - Atualize os componentes para usar as imagens

4. **Lottie (se desejar):**
   - Exporte animações do After Effects ou use LottieFiles
   - Salve em `public/landing-v2/lottie/`
   - Atualize `ValueProps.tsx` para usar Lottie

---

## 📝 Notas Importantes

- **Formato de arquivo:** Use PNG para mockups (melhor qualidade), JPG para fotos (menor tamanho)
- **Otimização:** Comprima imagens antes de adicionar (use TinyPNG, ImageOptim, etc.)
- **Responsividade:** As imagens serão otimizadas automaticamente pelo Next.js Image
- **Fallbacks:** O código já tem fallbacks caso as imagens não existam (iniciais nos avatares, placeholders nos mockups)

---

## 🚀 Após Adicionar as Imagens

1. **Mockups:** Descomente o código em `StickyStepper.tsx`
2. **Teste:** Execute `npm run dev` e verifique se as imagens aparecem
3. **Otimize:** Verifique o tamanho dos arquivos e comprima se necessário
4. **Build:** Teste o build de produção: `npm run build`
