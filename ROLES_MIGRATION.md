# Sistema de Roles Many-to-Many

Este documento descreve a implementação do sistema de roles many-to-many no FlicApp.

## 📋 Resumo das Mudanças

A estrutura de roles foi alterada de um campo único no modelo `User` para um relacionamento many-to-many, permitindo que um usuário tenha múltiplas roles simultaneamente.

## 🗄️ Estrutura do Banco de Dados

### Tabelas Criadas

1. **`role`** - Armazena as roles disponíveis
   - `id`: Identificador único
   - `name`: Nome da role (enum UserRole)
   - `createdAt`: Data de criação
   - `updatedAt`: Data de atualização

2. **`user_role_assignment`** - Tabela de relacionamento
   - `id`: Identificador único
   - `userId`: ID do usuário
   - `roleId`: ID da role
   - `createdAt`: Data de criação
   - `updatedAt`: Data de atualização

### Relacionamentos

- `User` ↔ `UserRoleAssignment` (1:N)
- `Role` ↔ `UserRoleAssignment` (1:N)
- `User` ↔ `Role` (N:N através de UserRoleAssignment)

## 🔧 Funcionalidades Implementadas

### Utilitários (`src/lib/role-utils.ts`)

- `initializeRoles()`: Inicializa as roles básicas no banco
- `assignRoleToUser()`: Atribui uma role a um usuário
- `removeRoleFromUser()`: Remove uma role de um usuário
- `getUserRoles()`: Obtém todas as roles de um usuário
- `userHasRole()`: Verifica se usuário tem uma role específica
- `userHasAnyRole()`: Verifica se usuário tem pelo menos uma das roles
- `getUserWithRoles()`: Obtém usuário com roles incluídas

### Hook Atualizado (`src/hooks/use-user-role.ts`)

O hook `useUserRole` foi atualizado para trabalhar com múltiplas roles:

```typescript
const { 
  userRole,        // Role principal (primeira role)
  userRoles,       // Array com todas as roles
  isAdmin,         // Verifica se tem role ADMINISTRADOR
  isProvider,      // Verifica se tem role PRESTADOR
  isClient,        // Verifica se tem role CLIENTE
  hasRole,         // Verifica role específica
  hasAnyRole,      // Verifica múltiplas roles
  rolesDisplayNames // Nomes das roles para exibição
} = useUserRole();
```

### APIs Criadas

1. **GET** `/api/user/[userId]/roles`
   - Retorna todas as roles de um usuário

2. **POST** `/api/user/[userId]/roles/manage`
   - Atribui ou remove roles de um usuário
   - Body: `{ roleName: UserRole, action: "assign" | "remove" }`

### Componentes

1. **`RoleBasedDashboard`** - Atualizado para mostrar múltiplas roles
2. **`UserRoleManager`** - Novo componente para gerenciar roles (admin)

## 🚀 Como Usar

### Inicializar Roles

```bash
npx tsx scripts/init-roles.ts
```

### Demonstração Completa

```bash
npx tsx scripts/demo-roles.ts
```

### Exemplo de Uso no Código

```typescript
import { assignRoleToUser, getUserRoles } from "@/lib/role-utils";

// Atribuir múltiplas roles
await assignRoleToUser("user-id", UserRole.CLIENTE);
await assignRoleToUser("user-id", UserRole.PRESTADOR);

// Verificar roles
const roles = await getUserRoles("user-id");
console.log(roles); // ['CLIENTE', 'PRESTADOR']
```

### Exemplo no Frontend

```typescript
const { userRoles, hasAnyRole } = useUserRole();

// Verificar se usuário tem qualquer uma das roles
if (hasAnyRole([UserRole.ADMINISTRADOR, UserRole.PRESTADOR])) {
  // Mostrar conteúdo para admin ou prestador
}
```

## 🔄 Migração

A migração `20251020192811_refactor_user_roles_to_many_to_many` foi aplicada com sucesso:

- Removeu o campo `role` da tabela `user`
- Criou as tabelas `role` e `user_role_assignment`
- Estabeleceu os relacionamentos e índices necessários

## 📝 Benefícios

1. **Flexibilidade**: Usuários podem ter múltiplas roles
2. **Escalabilidade**: Fácil adicionar novas roles
3. **Manutenibilidade**: Roles centralizadas em tabela separada
4. **Compatibilidade**: Hook mantém compatibilidade com código existente
5. **APIs**: Endpoints para gerenciar roles programaticamente

## 🎯 Casos de Uso

- Usuário que é tanto cliente quanto prestador
- Administrador que também presta serviços
- Usuários com roles temporárias
- Hierarquias de permissões complexas
