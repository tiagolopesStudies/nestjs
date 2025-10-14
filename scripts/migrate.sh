#!/bin/bash

# Script para configurar as migrações do Prisma sem schema explícito

# Função para executar migrações de desenvolvimento
migrate_dev() {
  echo "Executando migração de desenvolvimento..."
  # Remove referências ao schema public das migrações
  find prisma/migrations -name "*.sql" -exec sed -i 's/"public"\.//g' {} +
  
  # Executa a migração
  npx prisma migrate dev "$@"
}

# Função para executar migrações de deploy (para testes E2E)
migrate_deploy() {
  echo "Executando migração de deploy para testes E2E..."
  
  # Remove referências ao schema public das migrações temporariamente
  find prisma/migrations -name "*.sql" -exec sed -i 's/"public"\.//g' {} +
  
  # Executa o deploy das migrações
  npx prisma migrate deploy
}

# Função para resetar migrações
migrate_reset() {
  echo "Resetando migrações..."
  
  # Remove referências ao schema public das migrações
  find prisma/migrations -name "*.sql" -exec sed -i 's/"public"\.//g' {} +
  
  # Executa o reset
  npx prisma migrate reset --force
}

# Verifica o argumento passado
case "$1" in
  "dev")
    migrate_dev "${@:2}"
    ;;
  "deploy")
    migrate_deploy
    ;;
  "reset")
    migrate_reset
    ;;
  *)
    echo "Uso: $0 {dev|deploy|reset} [argumentos adicionais para dev]"
    echo "  dev    - Executa prisma migrate dev"
    echo "  deploy - Executa prisma migrate deploy"
    echo "  reset  - Executa prisma migrate reset --force"
    exit 1
    ;;
esac