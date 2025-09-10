# Morimitsu Dashboard API

Este projeto é uma API desenvolvida em Node.js para o dashboard Morimitsu.

## Requisitos

- Node.js >= 18.x
- pnpm >= 9.x

## Instalação

```bash
git clone https://github.com/ismael-henrique-dev/Morimitsu-Dashboard-API.git

cd morimitsu-dashboard-api

npm i
#ou 
pnpm i
```

## Configuração

Crie um arquivo `.env` com as variáveis de ambiente necessárias:

```env
PORT=3000
```

## Inicialização

```bash
pnpm dev
#ou
npm run dev
```

A API estará disponível em `http://localhost:3000`.

## Scripts úteis

- `npm run dev` — Inicia o servidor em modo desenvolvimento com hot reload.
- `npm test` — Executa os testes automatizados.

<!-- ## Estrutura do Projeto

```
src/
  controllers/
  models/
  routes/
  middlewares/
  app.js
```

## Contribuição

Pull requests são bem-vindos! Para grandes mudanças, abra uma issue primeiro para discutir o que você gostaria de modificar.

## Licença

Este projeto está sob a licença MIT. -->