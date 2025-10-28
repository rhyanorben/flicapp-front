# Database Seed

Este diretório contém os arquivos de migração e seed do banco de dados.

## 🚀 Como executar o seed

Para popular o banco de dados com dados iniciais, execute:

```bash
npm run db:seed
```

## 📊 Dados criados pelo seed

### Roles

- **ADMINISTRADOR**: Acesso total ao sistema
- **PRESTADOR**: Prestadores de serviços
- **CLIENTE**: Clientes que solicitam serviços

### Usuários de Exemplo

#### Administrador

- **Email**: `admin@flicapp.com`
- **Senha**: `Admin@FlicApp2024!`
- **Role**: ADMINISTRADOR

### Categorias de Serviços (35 categorias)

1. Vidraceiro
2. Transporte / Frete
3. Gesseiro
4. Fotógrafo / Filmagem
5. Pedreiro / Reforma
6. Pintor
7. Personal Trainer
8. Beleza - Maquiagem
9. Montador de Móveis
10. Manutenção de Eletrodomésticos
11. Dedetização
12. Jardinagem
13. Encanador
14. Eventos - Decoração
15. Eventos - Buffet
16. Piscineiro
17. Designer Gráfico
18. Chaveiro
19. Serralheiro
20. Mudança / Carretos
21. Suporte de Informática
22. Funilaria e Pintura Automotiva
23. Mecânico Automotivo
24. Beleza - Cabeleireiro
25. Limpeza Residencial
26. Outros
27. Eletricista
28. Marceneiro
29. Beleza - Manicure e Pedicure
30. Eventos - DJ / Som
31. Cuidador de Idosos
32. Instalador de Ar-Condicionado
33. Babá
34. Professor Particular

### Usuários de Exemplo

#### Prestador

- **Email**: `joao.prestador@flicapp.com`
- **Senha**: `JoaoPrestador2024!`
- **Nome**: João Silva - Prestador
- **Especialidades**: Limpeza, Pintura, Jardinagem
- **Disponibilidade**: Segunda a sexta, 8h às 18h
- **Raio de atendimento**: 15km

#### Cliente

- **Email**: `maria.cliente@flicapp.com`
- **Senha**: `MariaCliente2024!`
- **Nome**: Maria Santos - Cliente
- **Endereço**: Rua das Flores, 123 - Centro, São Paulo/SP

### Regras de Recusa

- **CANCEL_CLIENT_24H**: Cliente cancela com 24h+ de antecedência (100% crédito)
- **CANCEL_CLIENT_2H**: Cliente cancela com 2h+ de antecedência (50% crédito)
- **CANCEL_PROVIDER**: Prestador cancela (100% crédito para cliente)
- **NO_SHOW_CLIENT**: Cliente não comparece (50% para prestador, 50% plataforma)

### Pedido de Exemplo

- **Cliente**: Maria Santos
- **Serviço**: Limpeza Residencial
- **Status**: Pendente
- **Valor**: R$ 100,00
- **Caução**: R$ 20,00
- **Slots**: Manhã (9h-12h) e Tarde (14h-17h)

## 🔧 Comandos Úteis

```bash
# Executar migrações
npx prisma migrate dev

# Resetar banco e executar seed
npx prisma migrate reset

# Visualizar banco no Prisma Studio
npx prisma studio

# Gerar Prisma Client
npx prisma generate
```

## 📝 Notas Importantes

- O seed é idempotente (pode ser executado múltiplas vezes sem duplicar dados)
- Usa `upsert` para evitar conflitos
- Senhas são hasheadas com bcryptjs
- IDs são gerados automaticamente com UUID
- Todos os dados são criados com timestamps atuais
