# Desafio API - Semana de Tecnologia

## Rodar projeto:
Com o Node.js 18 e o NPM instalado em máquina, rode o seguinte comando na pasta do projeto.
Esse comando irá instalar as dependências no nosso projeto.

```bash
npm install
```
Preparar o Prisma ORM
```bash
 npx prisma generate
```
Rode o comando a seguir para rodar os testes.
```bash
npm run test
```

[Opcional] Caso queira testar a rota com um Cliente rode: <br />
```bash
npm run dev
```

## Banco de dados:
Optei por utilizar um Banco de Dados SQLite dentro do projeto para facilitar, não é o recomendado para outros ambientes. <br />
Também configurei o Prisma ORM, que é uma ferramente que ajuda na manipulação do banco etc. <br />
Caso queira visualizar o Banco de Dados, o Prisma oferece uma ferramenta também, rode o seguinte comando:
```bash
npx prisma studio
```
## O que fazer?
1. Dentro de "regras.md", você achará todas as rotas que você precisa desenvolver, e também a regra de negócio de cada uma e configurações necessária;
2. Rode o comando de teste e dentro do arquivo "routes.js" você irá construir as rotas;
3. Você poode separar e organizar melhor o projeto, a única condição é não mexer na pasta "tests";
4. Organização no projeto, será levando em conta na hora da avaliação;
5. Seu objetivo é fazer com que todos os testes passe a medida que você criando as rotas e suas regras.
