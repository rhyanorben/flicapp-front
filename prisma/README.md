# Prisma Database Setup

Este diretório contém a configuração do Prisma ORM para o projeto.

## Scripts Disponíveis

Execute os seguintes comandos na raiz do projeto:

- `npm run db:generate` - Gera o Prisma Client após mudanças no schema
- `npm run db:migrate` - Cria e aplica uma nova migration (desenvolvimento)
- `npm run db:migrate:deploy` - Aplica migrations pendentes (produção)
- `npm run db:migrate:reset` - Reseta o banco e aplica todas as migrations do zero
- `npm run db:migrate:status` - Verifica o status das migrations
- `npm run db:migrate:resolve` - Resolve problemas de migration (use com --applied ou --rolled-back)
- `npm run db:studio` - Abre o Prisma Studio para visualizar/editar dados
- `npm run db:seed` - Executa o seed do banco de dados
- `npm run db:encode-password` - Codifica senha com caracteres especiais para URL

## Configuração Inicial

### 1. Configurar DATABASE_URL

Crie um arquivo `.env` na raiz do projeto com:

```env
DATABASE_URL="postgresql://usuario:senha@host:porta/banco?schema=platform"
```

**Importante:** Se sua senha contém caracteres especiais, veja [DATABASE_URL_SETUP.md](./DATABASE_URL_SETUP.md).

### 2. Configurar Shadow Database (Opcional)

Para resolver problemas de shadow database, adicione também:

```env
SHADOW_DATABASE_URL="postgresql://usuario:senha@host:porta/shadow_db?schema=platform"
```

Veja [SHADOW_DATABASE_FIX.md](./SHADOW_DATABASE_FIX.md) para mais detalhes.

### 3. Gerar Prisma Client

```bash
npm run db:generate
```

### 4. Aplicar Migrations

```bash
npm run db:migrate
```

## Troubleshooting

### Erro P1013: Invalid Database URL

- **Causa:** Caracteres especiais na senha não codificados
- **Solução:** Veja [DATABASE_URL_SETUP.md](./DATABASE_URL_SETUP.md)

### Erro P3014: Shadow Database Error

- **Causa:** Problema com template database ou permissões
- **Solução:** Veja [SHADOW_DATABASE_FIX.md](./SHADOW_DATABASE_FIX.md)

### Erro P3018: Migration Failed - Tabela Já Existe

- **Causa:** Migration tentando criar tabela que já existe no banco
- **Solução:** Veja [MIGRATION_CONFLICT_FIX.md](./MIGRATION_CONFLICT_FIX.md)

## Estrutura

- `schema.prisma` - Schema do banco de dados
- `migrations/` - Histórico de migrations
- `seed.ts` - Script de seed para dados iniciais

## Documentação Adicional

- [DATABASE_URL_SETUP.md](./DATABASE_URL_SETUP.md) - Como configurar DATABASE_URL com caracteres especiais
- [SHADOW_DATABASE_FIX.md](./SHADOW_DATABASE_FIX.md) - Como resolver problemas de shadow database
- [MIGRATION_CONFLICT_FIX.md](./MIGRATION_CONFLICT_FIX.md) - Como resolver conflitos de migration (tabela já existe)
