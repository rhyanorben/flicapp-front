# Configuração da DATABASE_URL

## Problema: Caracteres Especiais na Senha

Se você receber o erro:

```
Error: P1013: The provided database string is invalid. invalid port number in database URL.
```

Isso geralmente acontece quando a senha do banco de dados contém caracteres especiais que precisam ser codificados (URL encoded) na string de conexão.

## Solução

### Opção 1: Usar o Script Automático (Recomendado)

1. Execute o script passando sua senha como argumento:

   ```bash
   npm run db:encode-password "sua-senha-com-caracteres-especiais"
   ```

2. O script irá mostrar a senha codificada. Use essa versão codificada na sua `DATABASE_URL`.

### Opção 2: Codificação Manual

Caracteres especiais comuns e suas codificações:

| Caractere | Codificação |
| --------- | ----------- |
| `>`       | `%3E`       |
| `<`       | `%3C`       |
| `@`       | `%40`       |
| `#`       | `%23`       |
| `%`       | `%25`       |
| `&`       | `%26`       |
| `+`       | `%2B`       |
| `=`       | `%3D`       |
| `?`       | `%3F`       |
| `/`       | `%2F`       |
| `:`       | `%3A`       |
| `;`       | `%3B`       |
| `,`       | `%2C`       |
| `[`       | `%5B`       |
| `]`       | `%5D`       |
| `{`       | `%7B`       |
| `}`       | `%7D`       |
| `\|`      | `%7C`       |
| `\`       | `%5C`       |
| `^`       | `%5E`       |
| `~`       | `%7E`       |
| `` ` ``   | `%60`       |
| `"`       | `%22`       |
| `'`       | `%27`       |
| `!`       | `%21`       |
| `$`       | `%24`       |
| `(`       | `%28`       |
| `)`       | `%29`       |
| `*`       | `%2A`       |

### Opção 3: Usar encodeURIComponent no Node.js

Se você tem acesso ao Node.js, pode usar:

```javascript
const password = "sua-senha>B3K@123";
const encoded = encodeURIComponent(password);
console.log(encoded); // senha%3EB3K%40123
```

## Exemplo Prático

**URL Original (com erro):**

```
DATABASE_URL="postgresql://n8n-user:...>B3K...@51.222.137.110:5432/n8n-postgres?schema=platform"
```

**URL Corrigida:**

```
DATABASE_URL="postgresql://n8n-user:...%3EB3K...@51.222.137.110:5432/n8n-postgres?schema=platform"
```

Note que o caractere `>` foi substituído por `%3E`.

## Formato Completo da DATABASE_URL

```
postgresql://[usuario]:[senha-codificada]@[host]:[porta]/[banco]?schema=[schema]
```

## Verificação

Após configurar a `DATABASE_URL` no arquivo `.env`, teste a conexão:

```bash
npm run db:migrate
```

Se a conexão estiver correta, o Prisma conseguirá se conectar ao banco de dados.
