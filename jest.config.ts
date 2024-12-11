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
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
  verbose: true,
};

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
export default createJestConfig(config);

// Após a instalacao
/**
 - Eu troquei a extensao desse arquivo de javascript para typescript, por conta disso foi necessario instalar o ts-node;
 - Dentro de config, eu tive que colocar o setupFilesAfterEnv passando o caminho do setup, pois alguns erros estavam ocorrendo;
 - Tive que instalar a versao do testing library para 15 atraves desse comando -> npm i @testing-library/react@15.0.6; 
 */
