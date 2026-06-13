# Brazino Beaming

Site exclusivo para membros com cargo Discord, com autenticação OAuth2 e verificação de cargo em tempo real.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — rodar o servidor API (porta 8080)
- `pnpm --filter @workspace/brazino-site run dev` — rodar o site React (porta 23750)
- `pnpm run typecheck` — typecheck completo
- `pnpm --filter @workspace/api-spec run codegen` — regenerar hooks e schemas

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- API: Express 5 + express-session
- Auth: Discord OAuth2 (guilds.members.read scope)
- Frontend: React + Vite
- Build: esbuild (CJS bundle)

## Where things live

- `lib/api-spec/openapi.yaml` — contrato da API (source of truth)
- `artifacts/api-server/src/routes/auth.ts` — rotas Discord OAuth
- `artifacts/api-server/src/site-html.ts` — HTML do site original (processado)
- `artifacts/brazino-site/src/App.tsx` — gate de autenticação React

## Architecture decisions

- O HTML original do site GitHub é servido via endpoint autenticado `/api/site` — só acessível com sessão válida
- Sessão gerenciada com `express-session` (MemoryStore em dev, cookie httpOnly)
- Verificação de cargo via `guilds.members.read` scope (sem precisar de bot na conversa direta)
- O iframe do site recebe o HTML do endpoint protegido, mantendo todo conteúdo gateado

## Product

Página de login Discord que verifica se o usuário tem o cargo `1449498055987433584` no servidor `1448504707462070457`. Apenas membros autorizados acessam o conteúdo do site Brazino Beaming.

## User preferences

- Site em português (pt-BR)
- Tema verde escuro (#0D2818 / #39D353)

## Gotchas

- **IMPORTANTE:** O redirect URI deve ser cadastrado no Discord Developer Portal. Ver seção abaixo.
- A URL de callback é: `https://<domínio-replit>/api/auth/callback`
- `SESSION_SECRET` já está configurado como secret
- `DISCORD_CLIENT_ID`, `DISCORD_GUILD_ID`, `DISCORD_ROLE_ID` são env vars (não secrets)
- `DISCORD_BOT_TOKEN` e `DISCORD_CLIENT_SECRET` são Replit Secrets

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
