# efood — projeto EBAC módulos 35–38

Aplicação React/TypeScript com React Router, styled-components, Redux Toolkit e RTK Query. Layout implementado a partir dos frames Home, Perfil, Modal, Carrinho, Entrega, Pagamento e Confirmação do Figma efood: https://www.figma.com/design/MQ8dnGfgYl7xbJCrukjsAr/efood--Copy-?node-id=0-1

## Executar e validar

```sh
npm ci
npm run dev
npm test
npm run build
```

20 testes cobrem carrinho, cálculo monetário, contratos, cache de consultas, navegação, detalhes do produto, entrega, checkout simulado e confirmação. Os testes não fazem pedidos reais.

## Funcionalidades

- Catálogo e cardápios obtidos da API oficial, com carregamento, erro e nova tentativa.
- Navegação entre restaurantes por React Router.
- Modal com descrição completa, porção e inclusão no carrinho.
- Carrinho Redux com remoção, quantidade e total calculado em centavos.
- Formulários de entrega e pagamento validados com Zod; dados de cartão não persistidos nem enviados a actions Redux.
- POST de checkout acionado somente pelo botão de finalizar; confirmação mostra o orderId retornado pela API. Falhas preservam carrinho e permitem tentar novamente.
- Layout responsivo, diálogo com controle de foco, fechamento por Escape e labels acessíveis.
- Assets estáticos originais do Figma locais; Roboto fornecida pelo pacote @fontsource/roboto. Fotos, nomes, descrições e preços permanecem dinâmicos conforme a API.

## API

Endpoints fornecidos nos exercícios:

- GET https://api-ebac.vercel.app/api/efood/restaurantes
- GET https://api-ebac.vercel.app/api/efood/checkout — contrato do request
- POST https://api-ebac.vercel.app/api/efood/checkout — envia o pedido educacional

Os GETs foram consultados para capturar fixtures e validar o esquema. Cada quantidade é representada por unidades repetidas no array products, pois o contrato não possui quantity. Cliente com transporte injetável permite testar o checkout sem enviar pedidos.

## Publicação

Workflow .github/workflows/pages.yml executa npm ci, testes e build e publica dist no GitHub Pages. Configurar Settings → Pages → Source: GitHub Actions. HashRouter e base relativa mantêm navegação e assets compatíveis com o subdiretório do repositório.

URL prevista: https://guiga-dev.github.io/ebac-efood/

## Estrutura

- src/ui: catálogo, modal, carrinho, checkout e estilos baseados no Figma.
- src/features: reducer do carrinho, validação do pedido e hook de checkout.
- src/services: cliente HTTP e consultas RTK Query.
- src/domain: contratos de entrada/saída.
- tests: testes unitários e de interação, com dados sintéticos.
- public/assets: assets originais usados; ver ASSETS.md.

## Validação de integração

Além dos testes simulados, o responsável pela revisão confirmou o fluxo pela interface com dados explicitamente fictícios no endpoint educacional: catálogo, perfil, modal, soma do carrinho, entrega, pagamento, retorno de orderId, confirmação e carrinho zerado ao concluir. Nenhum dado de formulário ou cartão usado nessa conferência é armazenado no repositório.

