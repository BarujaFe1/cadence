<div align="center">
  <img src="./public/favicon.svg" alt="Cadence Logo" width="120" height="120" />

  <h1>Cadence</h1>

  <p><strong>Companion local-first para rotina serena de estudo de idiomas.</strong></p>
  <p><strong>Local-first companion for a calm language-study routine.</strong></p>

  <p>
    <a href="#pt-br">PT-BR</a> ·
    <a href="#en">English</a> ·
    <a href="#live-demo">Live Demo</a> ·
    <a href="#stack--tecnologias">Stack</a> ·
    <a href="#arquitetura--architecture">Architecture</a> ·
    <a href="#quick-start--início-rápido">Quick Start</a> ·
    <a href="#autor--author">Author</a>
  </p>

  <p>
    <a href="https://cadence-ochre-six.vercel.app"><img alt="Live Demo" src="https://img.shields.io/badge/Live%20Demo-cadence--ochre--six.vercel.app-000000?style=for-the-badge&logo=vercel&logoColor=white" /></a>
    <img alt="Next.js" src="https://img.shields.io/badge/Next.js-15-000000?style=for-the-badge&logo=nextdotjs" />
    <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-React-3178C6?style=for-the-badge&logo=typescript&logoColor=white" />
    <img alt="Tailwind" src="https://img.shields.io/badge/Tailwind-CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" />
    <img alt="Zustand" src="https://img.shields.io/badge/Zustand-Local--first-000000?style=for-the-badge" />
    <img alt="Lab Demo" src="https://img.shields.io/badge/Status-Lab%20demo-2563EB?style=for-the-badge" />
  </p>

  <p>
    <a href="https://cadence-ochre-six.vercel.app"><strong>Live Demo</strong></a> ·
    <a href="https://github.com/BarujaFe1/cadence"><strong>Repositório</strong></a> ·
    <a href="https://barujafe.vercel.app/"><strong>Portfólio</strong></a> ·
    <a href="https://www.linkedin.com/in/barujafe/"><strong>LinkedIn</strong></a>
  </p>
</div>

---

<a id="pt-br"></a>

## PT-BR

## Visão geral

**Cadence** é um companion premium e local-first para acompanhar uma rotina diária de quatro idiomas (inglês, francês, alemão e espanhol) com timers elegantes, ajustes simples e histórico persistente no navegador.

> **Aviso de lab:** demo de portfólio com dados sintéticos/amostra. Não é produto em produção com SLA, integrações reais de clientes ou garantia operacional.

---

## Problema

Apps de idioma são barulhentos ou exigem conta. Falta um companion calmo, offline-friendly, só para a rotina do dia.

---

## Para quem

- Estudantes de idiomas com rotina diária
- Quem prefere local-first sem login
- Side project / lab pessoal de produto

---

## Funcionalidades

- Rotina: Inglês → Francês → Alemão → Espanhol
- Timer com iniciar / pausar / continuar / reiniciar
- Modo foco e som opcional
- Histórico, filtros, totais e streak
- Ajustes de duração por idioma
- Atalhos de teclado (Espaço, N, C, F)

---

## Escopo e limites

- **É:** companion local-first de rotina (lab / side project).
- **Não é:** Duolingo, SRS cloud, rede social de idiomas, sync multi-dispositivo.

---

<a id="en"></a>

## English

## Overview

**Cadence** is a premium local-first companion for a daily four-language routine (English, French, German and Spanish) with elegant timers, simple settings and browser-persisted history.

> **Lab notice:** portfolio demo with synthetic/sample data. Not a production product with SLA, real customer integrations, or operational guarantees.

---

## Problem

Language apps are noisy or account-heavy. Missing: a calm, offline-friendly companion just for today’s routine.

---

## Who it is for

- Language learners with a daily routine
- People who prefer local-first without login
- Personal product side-project / lab

---

## Features

- Routine: English → French → German → Spanish
- Timer with start / pause / resume / reset
- Focus mode and optional sound
- History, filters, totals and streak
- Per-language duration settings
- Keyboard shortcuts (Space, N, C, F)

---

## Scope and limits

- **Is:** local-first routine companion (lab / side project).
- **Is not:** Duolingo, cloud SRS, language social network, multi-device sync.

---

<a id="live-demo"></a>

## Live Demo

**URL:** [https://cadence-ochre-six.vercel.app](https://cadence-ochre-six.vercel.app)

Demo hospedada para avaliação de portfólio / Hosted for portfolio review.

> Lab demo — synthetic / sample data unless noted. Not a production SLA product.

---

<a id="stack--tecnologias"></a>

## Stack / Tecnologias

| Tecnologia | Uso no projeto |
|---|---|
| Next.js 15 / React 19 / TypeScript | App |
| Tailwind CSS 4 | Estilo |
| Zustand | Estado + persistência |
| Framer Motion | Microinterações |
| date-fns / Lucide / clsx | Utilitários e UI |

---

<a id="arquitetura--architecture"></a>

## Arquitetura / Architecture

App Next.js local-first: rotas em src/app, UI em components, store Zustand e helpers em lib. Sem backend.

`	xt
cadence/
├── public/favicon.svg
├── src/
│   ├── app/           # Hoje, Histórico, Ajustes
│   ├── components/
│   ├── lib/
│   └── store/         # Zustand + timer
├── package.json
├── pnpm-lock.yaml
└── vercel.json
`

---

<a id="quick-start--início-rápido"></a>

## Quick Start / Início rápido

### Pré-requisitos / Requirements

- Node.js 20+
- npm ou pnpm

### Clonar / Clone

`ash
git clone https://github.com/BarujaFe1/cadence.git
cd cadence
`

### Setup

`ash
npm install
# ou: pnpm install
npm run dev
`

Abra http://localhost:3000

`ash
npm run build
npm start
`

Sem variáveis de ambiente obrigatórias (local-first / localStorage).


---

## Technical decisions / Decisões técnicas

- **Local-first** — zero backend para este escopo.
- **Zustand + persist** para histórico no dispositivo.
- **Quatro idiomas fixos na rotina** com duração configurável.

---

## Roadmap

### Implementado
- Rotina diária, timer, foco, histórico, streak, ajustes, deploy Vercel

### Planejado
- Mais personalização de ordem
- Export/import de histórico
- Temas visuais adicionais

---

<a id="autor--author"></a>

## Autor / Author

Developed by **Felipe Alirio Baruja**.

- **Portfolio:** [https://barujafe.vercel.app/](https://barujafe.vercel.app/)
- **GitHub:** [github.com/BarujaFe1](https://github.com/BarujaFe1)
- **LinkedIn:** [linkedin.com/in/barujafe](https://www.linkedin.com/in/barujafe/)
- **Repository:** [github.com/BarujaFe1/cadence](https://github.com/BarujaFe1/cadence)

---

## License / Licença

Uso pessoal / portfólio. Sem arquivo LICENSE dedicado neste repositório.

---

<div align="center">
  <p><strong>Cadence</strong></p>
  <p>Rotina serena de idiomas, no seu ritmo.</p>
  <p><em>A calm language routine, at your pace.</em></p>
</div>
