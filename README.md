# Desafio Backend

## Variáveis de Ambiente

```bash
# Application
APP_PORT = 3001

# PostgreSQL
PG_HOST = localhost
PG_PORT = 3002
PG_DATABASE = challenge
PG_USER = challenger
PG_PASSWORD = icebucket
PG_VOLUME = /database/postgres:/challenge

# TypeORM
ORM_SYNC = true
```

### Rotas

- POST /pedidos --- Cadastra pedido
- POST /pedidos/pagina=0/itens=10 --- Busca pedidos por página

- POST /pessoas --- Cadastra pessoa
- GET /pessoas/cpf=12345678910 --- Busca pessoa por CPF
- POST /pessoas/pagina=0/itens=20 --- Busca pessoas por página
- PUT /pessoas --- Atualiza pessoa

- POST /produtos --- Cadastra produto
- GET /produtos/id=0 --- Busca produto por ID
- GET /produtos/pagina=0/itens=20 --- Busca produtos por página
- POST /produtos/pagina=0/itens=20/admin --- Busca produtos por página como Admin
- PUT /produtos --- Atualiza produto
- DELETE /produtos --- Deleta produto
