# Cadence

**Rotina serena de estudo de idiomas.**

Cadence é um companion premium para acompanhar uma rotina diária de quatro idiomas — inglês, francês, alemão e espanhol — com timers elegantes, configuração simples e histórico persistente.

Feito para abrir rápido, usar sem atrito e sentir progresso a cada bloco.

---

## Conceito

Um produto calmo, minimalista e refinado — inspirado na clareza de interfaces premium, sem imitar ninguém.

- Um idioma de cada vez
- Ritmo configurável
- Feedback visual suave
- Histórico que respeita sua consistência

## Stack

- **Next.js 15** (App Router)
- **TypeScript**
- **React 19**
- **Tailwind CSS 4**
- **Zustand** (estado + persistência)
- **Framer Motion** (microinterações)
- **localStorage** (local-first, sem login)

## Por que local-first?

Para este escopo, persistência no navegador é a escolha mais sólida:

- abre instantaneamente
- funciona offline
- zero configuração de backend
- sem autenticação desnecessária
- dados ficam no seu dispositivo

## Funcionalidades

### Hoje
- Rotina na ordem: Inglês → Francês → Alemão → Espanhol
- Timer por bloco com iniciar / pausar / continuar / reiniciar
- Concluir manualmente e avançar para o próximo
- Anel de progresso, status e celebração ao fechar o dia
- Modo foco
- Som opcional ao concluir
- Atalhos de teclado

### Histórico
- Registros por data e idioma
- Filtros
- Totais semanais e por idioma
- Streak de dias estudados (seg–sex)

### Ajustes
- Duração configurável por idioma
- Preferências de som e foco
- Reinício da rotina do dia

## Atalhos

| Tecla | Ação |
| --- | --- |
| `Espaço` | Iniciar / pausar / continuar |
| `N` | Próximo bloco |
| `C` | Concluir bloco atual |
| `F` | Alternar modo foco |

## Começar localmente

```bash
npm install
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000).

## Build

```bash
npm run build
npm start
```

## Repositório

- GitHub: [github.com/BarujaFe1/cadence](https://github.com/BarujaFe1/cadence)

## Deploy

### Vercel

O projeto **já está criado** na Vercel (`cadence`) e **conectado** ao GitHub.

Sem variáveis de ambiente. Framework: **Next.js**.

> Nota: no momento da criação, a conta atingiu o limite diário de deploys do plano Free. Assim que o limite resetar (em até 24h), rode:

```bash
cd ~/Projects/cadence
vercel deploy --prod --yes --scope barujafe1s-projects
```

Ou faça um push vazio / “Redeploy” no dashboard da Vercel.

URL esperada após o primeiro deploy: `https://cadence.vercel.app` (ou a URL que a Vercel atribuir ao projeto).

## Estrutura

```text
src/
  app/                 # rotas (Hoje, Histórico, Ajustes)
  components/          # UI do produto
  lib/                 # tipos, defaults, utils, storage
  store/               # estado Zustand + timer
public/
  favicon.svg
```

## Defaults sugeridos

| Idioma | Tempo |
| --- | --- |
| Inglês | 10 min |
| Francês | 8 min |
| Alemão | 12 min |
| Espanhol | 10 min |

Tudo editável em **Ajustes**.

## Licença

Uso pessoal / portfólio.
