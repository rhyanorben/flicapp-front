# Solução para Erro de Shadow Database (P3014)

## Problema

Erro ao executar `prisma migrate dev`:

```
Error: P3014
Prisma Migrate could not create the shadow database.
ERROR: template database "template1" has a collation version mismatch
```

Este erro ocorre quando o PostgreSQL tem uma incompatibilidade de versão de collation entre o template database e o sistema operacional.

## Soluções

### Solução 1: Usar um Shadow Database Diferente (Recomendado)

Configure uma variável de ambiente `SHADOW_DATABASE_URL` apontando para um banco de dados diferente (ou o mesmo banco com um nome diferente).

No seu arquivo `.env`, adicione:

```env
DATABASE_URL="postgresql://usuario:senha@host:porta/banco?schema=platform"
SHADOW_DATABASE_URL="postgresql://usuario:senha@host:porta/shadow_db?schema=platform"
```

**Nota:** O shadow database pode ser o mesmo banco, mas com um schema diferente, ou um banco completamente diferente.

### Solução 2: Corrigir o Template Database (Requer Acesso de Superusuário)

Se você tem acesso de superusuário ao PostgreSQL, execute:

```sql
ALTER DATABASE template1 REFRESH COLLATION VERSION;
```

Ou reconecte-se ao banco e execute:

```sql
-- Conecte-se como superusuário
\c template1

-- Atualize a versão de collation
ALTER DATABASE template1 REFRESH COLLATION VERSION;
```

### Solução 3: Usar Migrate Deploy (Produção)

Se você está em produção ou não precisa do shadow database, use `migrate deploy` em vez de `migrate dev`:

```bash
npm run db:migrate:deploy
```

**Atenção:** `migrate deploy` não usa shadow database, mas também não valida as migrations antes de aplicá-las.

### Solução 4: Desabilitar Shadow Database (Não Recomendado)

Você pode desabilitar o shadow database adicionando ao `schema.prisma`:

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
  // shadowDatabaseUrl não definido = usa o mesmo banco
}
```

E então criar manualmente um banco para shadow:

```sql
CREATE DATABASE shadow_db;
```

E configurar no `.env`:

```env
SHADOW_DATABASE_URL="postgresql://usuario:senha@host:porta/shadow_db"
```

## Configuração Recomendada

1. **Desenvolvimento:** Use `SHADOW_DATABASE_URL` apontando para um banco separado ou o mesmo banco com schema diferente.

2. **Produção:** Use `npm run db:migrate:deploy` que não requer shadow database.

## Verificação

Após configurar, teste:

```bash
npm run db:migrate
```

Se ainda houver problemas, verifique:

- Permissões do usuário do banco de dados
- Se o banco/schema especificado em `SHADOW_DATABASE_URL` existe
- Se a conexão está funcionando corretamente
