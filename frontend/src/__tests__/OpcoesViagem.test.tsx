import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import OpcoesViagem from "../components/OpcoesViagem";

jest.mock("../components/DriverCard", () => {
  return ({ onConfirm }: any) => (
    <button data-testid="driver-card" onClick={onConfirm}>
      Selecionar Motorista
    </button>
  );
});

jest.mock("../components/HistoricoViagens", () => {
  return () => <div data-testid="historico-viagens">Conteúdo do Histórico</div>;
});

describe("OpcoesViagem", () => {
  const mockOnBack = jest.fn();
  const mockData = {
    origin: { latitude: -23.55052, longitude: -46.633308 },
    destination: { latitude: -23.556944, longitude: -46.639444 },
    options: [
      {
        id: 1,
        name: "Motorista 1",
        vehicle: "Carro A",
        review: { rating: 4.5, comment: "Ótimo motorista" },
        value: 50.0,
      },
    ],
    distance: 5.0,
    duration: "15 mins",
  };

  it("deve voltar para a página inicial ao clicar em voltar no histórico", () => {
    render(<OpcoesViagem data={mockData} customerId="123" onBack={mockOnBack} />);
  
    const firstDriver = screen.getByTestId("driver-card");
    fireEvent.click(firstDriver);
  
    expect(screen.getByTestId("historico-viagens")).toBeInTheDocument();
  
    const backButton = screen.getByText("Voltar");
    fireEvent.click(backButton);
  
    expect(mockOnBack).toHaveBeenCalledTimes(1);
  });
});
