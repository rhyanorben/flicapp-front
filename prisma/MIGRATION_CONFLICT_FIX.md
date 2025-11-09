# Solução para Erro de Migration: Tabela Já Existe (P3018)

## Problema

Erro ao aplicar migration:

```
Error: P3018
A migration failed to apply. New migrations cannot be applied before the error is recovered from.
ERROR: relation "users" already exists
```

Isso acontece quando o banco de dados já contém tabelas que a migration está tentando criar.

## Soluções

### Solução 1: Marcar Migration como Aplicada (Recomendado se o banco já está correto)

Se o banco de dados já está no estado correto (tabelas já existem e estão corretas), você pode marcar a migration como aplicada sem executá-la:

```bash
npx prisma migrate resolve --applied 20251028025007_merge_postgresql_schema
```

Depois, continue com as migrations:

```bash
npm run db:migrate
```

### Solução 2: Marcar Migration como Revertida e Recriar

Se você precisa refazer a migration:

```bash
# Marcar como revertida
npx prisma migrate resolve --rolled-back 20251028025007_merge_postgresql_schema

# Depois, você pode:
# - Modificar a migration manualmente
# - Ou criar uma nova migration que verifica se as tabelas existem
```

### Solução 3: Verificar Estado do Banco e Sincronizar

1. Verifique quais migrations foram aplicadas:

```bash
npx prisma migrate status
```

2. Se o banco está desatualizado, você pode:

```bash
# Gerar uma nova migration baseada no estado atual do banco
npx prisma migrate dev --create-only --name sync_existing_tables

# Editar a migration gerada para remover comandos que criam tabelas existentes
# Depois aplicar
npm run db:migrate
```

### Solução 4: Reset Completo (CUIDADO: Apaga todos os dados)

**⚠️ ATENÇÃO: Isso apagará todos os dados do banco!**

```bash
npm run db:migrate:reset
```

Isso vai:

1. Dropar todas as tabelas
2. Aplicar todas as migrations do zero
3. Executar o seed (se configurado)

### Solução 5: Modificar a Migration Manualmente

Se você tem certeza de que as tabelas já existem e estão corretas:

1. Edite o arquivo da migration:
   `prisma/migrations/20251028025007_merge_postgresql_schema/migration.sql`

2. Adicione verificações `IF NOT EXISTS` ou remova os comandos `CREATE TABLE` que já existem.

3. Marque como aplicada:
   ```bash
   npx prisma migrate resolve --applied 20251028025007_merge_postgresql_schema
   ```

## Verificação

Após resolver o problema, verifique o status:

```bash
npx prisma migrate status
```

Deve mostrar que todas as migrations estão aplicadas.

## Prevenção

Para evitar esse problema no futuro:

1. **Sempre use migrations** - Não crie tabelas manualmente
2. **Sincronize o schema** - Use `prisma db pull` se o banco foi modificado externamente
3. **Use ambientes separados** - Desenvolvimento, staging e produção devem ter seus próprios bancos
