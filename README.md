# Ferramentas de testes Next/React.js

## Introdução

Este é um informativo do que estou estudando sobre testes em geral, voltados para frameworks e bibliotecas atuais como Next.js e React.js. O objetivo é ser capaz de entender e desenvolver testes de qualidade, para que reduzir a quantidade de erros nas aplicações.

## Tipos de testes

Existem diversos tipos de testes voltados para difentes propósitos e causas, aqueles que são realizados pelo próprio programador durante o desenvolvimento, outros que testam a implantação com diferentes componentes e também de fluxo completo, onde todas as funcionalidades podem ser testadas. Dentre os principais temos:

### Teste unitário

Eles testam partes separadas da aplicação, não algo mais completo como um fluxo E2E que testa todo um processo. Podemos usar um teste unitário para testar funções separadas, hooks e funcionalidades da aplicação. Ele tem um escopo menor em relação a outros tipos de testes.

### Teste de integração

Validam a integração entre funcionalidades com outras do projeto, por exemplo um componente que altera um estado no hook. Resumidamente, quando temos diversos módulos separados funcionando individualmente e precisamos ter a certeza que quando eles forem juntados todo o fluxo ocorra normalmente sem problemas.

### Teste end to end (E2E)

São testes reais que simulam ações do usuário, seja preenchendo algum formulárioa, clicando em algum botão e navegar entre páginas. Esse teste garante que todas as partes do sistema funcionem juntas como esperado. Para realizar esse teste, o Jest não é recomendado, outras ferramentas são bem vistas pelos desenvolvedores, como o Cypress, que consegue pegar os elementos da página e realizar ações como as do usuário. Em um exemplo prático, nós podemos criar um teste de um formulário de login, onde a aplicação acessa a página de login, preenche o formulário, faz o envio do mesmo e é feita a validação se o login foi um sucesso ou não.

### Teste de Mock

Um teste de mock com Jest é uma técnica usada para isolar e simular dependências externas em um teste unitário. Isso permite testar o comportamento de uma função ou componente sem depender de implementações reais, como APIs, bancos de dados ou outras funções. Nós mockamos a função para implementar sobre a função real, assim nós alteramos ou mexemos em algo que não queríamos.

### Teste de snapshot

Esse teste tem como objetivo capturar o estado visual ou estrutural de um componente, onde ele consegue acessar diretamente o HTML renderizado. Podemos usar esse teste para garantir que a saída de um componente JSX não mudou inesperadamente. Seu fluxo de funcionamento é execução, captura do conteúdo, armazenamento da captura em um arquivo ou no banco de dados, o teste é rodado para finalmente fazer a comparação com o esperado. Nesse teste de Snapshot, um arquivo ".snap" é gerado, ele contém o conteúdo que foi analisado durante o teste.

## Lógica a ser seguida

A primeira coisa após ter sua task/componente/funcionalidade desenvolvida, e você quer começar os testes, precisará ter conhecimento sobre a sua funcionalidade desenvolvida, pois precisaremos saber ao certo o que vai ser renderizado pois têm funções onde passamos o valor esperado de retorno.

### Boa práticas

- Para cada página de componente Next (`page.tsx`) criamos os testes unitários próximos do mesmo, isto é, no caminho onde estiver o componente a ser testado `exemplo.tsx` podemos criar o arquivo de testes `exemplo.test.tsx`, isso facilita para realizar alterações rapidamente durante os testes unitários. Exemplo de estrutura com páginas e componentes e seus respectivos testes unitários:

  ```plaintext
  src/
  ├── components/
  │   ├── Button/
  │   │   ├── Button.tsx
  │   │   └── Button.test.tsx
  │   ├── Header/
  │       ├── Header.tsx
  │       └── Header.test.tsx
  ├── pages/
  │   ├── Home/
  │   │   ├── Home.tsx
  │   │   └── Home.test.tsx
  │   └── Login/
  │       ├── Login.tsx
  │       └── Login.test.tsx
  ```

- Para testes maiores E2E e de integração podemos adotar uma abordagem de separá-los em folders dentro da pasta `__tests__`, essa é a pasta criada pelo Jest para ajudar na organização. Ainda podems criar outros folders dentro deles para ficar ainda mais organizado. Organização de testes maiores:

  ```plaintext
  __tests__/
  ├── unit/
  │   ├── Button.test.tsx
  │   └── Header.test.tsx
  ├── integration/
  │   └── NavbarIntegration.test.tsx
  └── e2e/
      └── LoginE2E.cy.ts

  ```

- Cada teste deve ser independente do outro, não são levados em conta outros resultados de outros testes. além disso, cada um deles deve ter uma descrição e comentário sobre o que ele espera e o que ele faz.

- Saber usar Mocks, eles ajudam a isolar dependências, mas quando usados em excesso podem causar problemas.

- Como temos que pegar o conteúdo dos componentes para serem testados, uma boa abordagem seria adicionar aria-label com nomes únicos para que sejam identificados mais rapidamente. Podemos fazer isso pegando o botao e especificando o seu nome:

  ```bash
  # botao no componente
  <button type="button" aria-label="Incrementar contador" onClick={() => setCount(count + 1)}>
    +
  </button>

  # na parte de testes
  screen.getByRole("button", { name: /incrementar contador/i });
  ```

- Em JavaScript, e em bibliotecas como a React Testing Library, quando você usa `/texto/i`:

  texto é o padrão que você está tentando encontrar.
  /i diz que tanto "Texto", "TEXTO", "texto", ou até mesmo "TeXtO" são válidos.

  ```bash
  const regex = /texto/i;

  console.log(regex.test("Texto")); // true
  console.log(regex.test("TEXTO")); // true
  console.log(regex.test("TeXtO")); // true
  console.log(regex.test("algo"));  // false

  ```

- Usar SSR, os componentes que são renderizados no lado do servidor, podem exigir uma configuração a parte de um mock para que funcione corretamente. Um exemplo disso é o `next/router` onde deve ser criado um mock para evitar falhas. Isso basicamente irá sobescrever a função com valores fictícios, um exemplo com o useRouter:

  Podemos usar como exemplo um componente qualquer que mostra o caminho via `useRouter`:

  ```bash
  import { useRouter } from "next/router";

  export default function PostTitle() {
    const { query } = useRouter();
    return <h1>Post: {query.slug || "Default"}</h1>;
  }

  ```

  Dentro do nosso teste vamos mockar (substituir/sobescrever) nossa função com valores que não são reais, usados apenas para fins de teste:

  ```bash
  import { render, screen } from "@testing-library/react";
  import PostTitle from "./PostTitle";
  import { useRouter } from "next/router";

  jest.mock("next/router");

  test("renders post title with slug", () => {
    // Configura o mock do useRouter
    useRouter.mockReturnValue({
      query: { slug: "example-post" },
    });

    // Renderiza o componente
    render(<PostTitle />);

    // Verifica se o título foi renderizado corretamente
    expect(screen.getByText("Post: example-post")).toBeInTheDocument();
  });
  ```

- Caso o seu arquivo não esteja sendo carregado nos testes, talvez seja necessário fazer uma configuração extra em `jest.config.ts` para que o Jest possa encontrar o seu arquivo/extensões de arquivos.

- É possível mockar atributos parciais de um módulo com Jest, podemos fazer isso da seguinte maneira:

  ```bash
  # arquivo original que será testado
  //foo-bar-baz.js
  export const foo = 'foo';
  export const bar = () => 'bar';
  export default () => 'baz';
  ```

  Agora nós vamos mockar apenas `foo` e o `defaultExport`, que nesse caso possui o valor `baz`.

  ```bash
  # arquivo de teste
  //test.js
  import defaultExport, {bar, foo} from '../foo-bar-baz';

  jest.mock('../foo-bar-baz', () => {
    const originalModule = jest.requireActual('../foo-bar-baz');

    //Mock the default export and named export 'foo'
    return {
      __esModule: true,
      ...originalModule,
      default: jest.fn(() => 'mocked baz'),
      foo: 'mocked foo',
    };
  });

  test('should do a partial mock', () => {
    const defaultExportResult = defaultExport();
    expect(defaultExportResult).toBe('mocked baz');
    expect(defaultExport).toHaveBeenCalled();

    expect(foo).toBe('mocked foo');
    expect(bar()).toBe('bar');
  });
  ```

  Como é possível ver acima, nós mockamos todo o módulo `../foo-bar-baz` usando o `jest.requireActual` que obtém o módulo atual, setamo o `__esModule` como `true` para que não ocorra problemas no padrão de exportação ES Modules. Alteramos o `defaultExport`para o valor desejado, assim como a propriedade `foo`. Em seguida nossos testes validam se essas alterações foram realizadas com sucesso.

## Principais ferramentas para testes

As duas principais ferramentas usadas para testes em geral em stacks Next e React são **Jest** e **Cypress**, vamos abordar cada uma delas e em quais tipos de testes elas melhores se encaixam.

### Jest

Seu foco principal é para teste unitários e de integração, sendo rápido e bem integrado com o ecossistema React/Next.js. Além desses dois tipos de testes ele também fornece suporte para teste de snapshot.

#### Instalação e configuração do Jest para Next

Seguindo a [documentação oficial do Next](https://nextjs.org/docs/pages/building-your-application/testing/jest) a instalação e configuração é bem simples, pois pelo próprio terminal é possível já ir configurando algumas coisas básicas. Na maior parte do processo apenas clicamos em "yes" para que ele faça tudo sozinho.

A instalação do Jest pode ser feita através do seguinte comando:

```bash
# npm
npm install -D jest jest-environment-jsdom @testing-library/react @testing-library/dom @testing-library/jest-dom ts-node
# yarn
yarn add -D jest jest-environment-jsdom @testing-library/react @testing-library/dom @testing-library/jest-dom ts-node
# pnpm
pnpm install -D jest jest-environment-jsdom @testing-library/react @testing-library/dom @testing-library/jest-dom ts-node
```

Um ponto legal é caso esteja iniciando, eles forcem também um exemplo pronto de um projeto, que pode ser criado a partir do seguinte comando:

```bash
# criação de projeto com exemplo
npx create-next-app@latest --example with-jest with-jest-app
```

Depois de ter inslatado ou criado seu projeto, a única alteração que devemos fazer é substituir o arquivo `jest.config.ts` que possui diversos comentários para o seguinte bloco de código:

```typescript
import type { Config } from "jest";
import nextJest from "next/jest.js";

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
  dir: "./",
});

// Add any custom config to be passed to Jest
const config: Config = {
  coverageProvider: "v8",
  testEnvironment: "jsdom",
  // Add more setup options before each test is run
  // setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
};

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
export default createJestConfig(config);
```

Feito isso, as outras configurações são apenas opcionais.

## Virtual enviroments (.env)

É de suma importância configurar os `.env` para os diferentes tipos de ambientes, sendo eles de development, test e production. Isso será controlado através do `NODE_ENV` que reconhece qual virtual enviroment deve ser carregado. Um ponto importante é que as variáveis de ambiente em produção e desenvolvimento não serão carregadas em ambiente de teste. *"Apart from development and production environments, there is a 3rd option available: test. In the same way you can set defaults for development or production environments, you can do the same with a `.env.test` file for the testing environment (though this one is not as common as the previous two). Next.js will not load environment variables from `.env.development` or `.env.production` in the testing environment."*

## Como rodar um teste

Para rodar um teste, podemos configurar alguns scripts no `package.json` para que não seja necessário ficar escrevendo tanta coisa no console, um exemplo de como poderia ficar o nosso `package.json`:

```bash
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "test": "jest --watch",
    "test:ci": "jest --ci"
  },
```

Rodando o comando "test" ele automaticamente já fica no modo `watch`, que consegue ficar observando mudanças, toda vez que alguma acontecer, ele roda os testes novamente. Isso fica a critério do desenvolvedor de colocar ou não essa flag.

Ainda temos o modo `coverage`que nos fornece detalhes em tabela sobre os testes, podemos conseguir isso rodando o seguinte comando:

```bash
# roda em modo de coverage
pnpm test -- --coverage
```

### Cypress
