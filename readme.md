# Morimitsu Dashboard API

Este projeto é uma API desenvolvida em Node.js para o dashboard Morimitsu. 

## Tecnologias Utilizadas
- Node.js
- express
- Typescript
- Prisma ORM
- Postgresql
- Json
- zod 

## Requisitos

- Node.js >= 18.x
- pnpm >= 9.x

## Instalação

```bash
git clone https://github.com/ismael-henrique-dev/Morimitsu-Dashboard-API.git

cd Morimitsu-Dashboard-API

npm i
#ou 
pnpm i
```

## Configuração

Crie um arquivo `.env` com as variáveis de ambiente necessárias:

As variáveis de ambiente estarão enviadas no Google classroom como arquivo .TXT compactado em ZIP(descompacte), copie as configurações ENV e cole-as no arquivo .env

Verifique as variaveis de ambiente no `.env.exemple`

## Inicialização

```bash
pnpm dev
#ou
npm run dev
```

A API estará disponível em `http://localhost:5000`.

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
