#!/usr/bin/env node

/**
 * Script para codificar corretamente a senha na DATABASE_URL
 *
 * Uso:
 *   node scripts/encode-db-url.js "sua-senha-com-caracteres-especiais"
 *
 * Ou defina a variável de ambiente:
 *   DATABASE_URL_PASSWORD="sua-senha" node scripts/encode-db-url.js
 */

const password = process.argv[2] || process.env.DATABASE_URL_PASSWORD;

if (!password) {
  console.error(
    "❌ Erro: Forneça a senha como argumento ou via DATABASE_URL_PASSWORD"
  );
  console.log("\nUso:");
  console.log('  node scripts/encode-db-url.js "sua-senha"');
  console.log("  ou");
  console.log(
    '  DATABASE_URL_PASSWORD="sua-senha" node scripts/encode-db-url.js'
  );
  process.exit(1);
}

// Codifica a senha para URL
const encodedPassword = encodeURIComponent(password);

console.log("\n📋 Senha codificada para URL:");
console.log(encodedPassword);
console.log("\n✅ Use esta senha codificada na sua DATABASE_URL");
console.log("\nExemplo completo:");
console.log(
  `DATABASE_URL="postgresql://usuario:${encodedPassword}@host:porta/banco?schema=platform"`
);
