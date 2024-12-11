// esse jsdom é importante para dizer que o teste simula o ambiente DOM do navegador
/**
 * @jest-environment jsdom
 */

// importa as funcoes usadas durante o teste e componente a ser testado, nesse caso o Counter
import { fireEvent, render, screen } from "@testing-library/react";
import Counter from "./counter";

// primeiro caso de teste
it("App Router: Works with Client Components (React State)", () => {
  // renderiza o componente Counte no DOM virtual
  render(<Counter />);

  // pega o componente heading, que nesse caso é um h2, e ve se o conteudo texto é igual a 0
  expect(screen.getByRole("heading")).toHaveTextContent("0");

  // evento que clica no botao
  fireEvent.click(screen.getByRole("button"));

  // pega o componente heading, que nesse caso é um h2, e ve se o conteudo texto é igual a 1
  expect(screen.getByRole("heading")).toHaveTextContent("1");
});
