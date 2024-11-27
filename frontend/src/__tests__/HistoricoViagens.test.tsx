import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import axios from "axios";
import HistoricoViagens from "../components/HistoricoViagens";

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("HistoricoViagens", () => {
  beforeEach(() => {
    mockedAxios.get.mockReset();
  });

  it("deve exibir carregando enquanto busca dados", async () => {
    mockedAxios.get.mockResolvedValueOnce({ data: [] });

    render(<HistoricoViagens />);

    fireEvent.click(screen.getByText("Aplicar Filtro"));

    expect(screen.getByText("Carregando...")).toBeInTheDocument();
    expect(await screen.findByText("Nenhuma viagem encontrada.")).toBeInTheDocument();
  });

  it("deve exibir erro ao falhar na busca de motoristas", async () => {
    mockedAxios.get.mockRejectedValueOnce(new Error("Erro ao buscar motoristas"));

    render(<HistoricoViagens />);

    expect(await screen.findByText("Erro ao carregar a lista de motoristas.")).toBeInTheDocument();
  });

  it("deve exibir erro ao falhar na busca do histórico", async () => {
    mockedAxios.get.mockResolvedValueOnce({ data: [] }); // Motoristas
    mockedAxios.get.mockRejectedValueOnce(new Error("Erro ao buscar o histórico"));

    render(<HistoricoViagens />);

    fireEvent.click(screen.getByText("Aplicar Filtro"));

    expect(await screen.findByText("Erro ao carregar o histórico de viagens.")).toBeInTheDocument();
  });

  it("deve exibir o histórico de viagens corretamente", async () => {
    const motoristasMock = [
      { id: 1, name: "Motorista 1" },
      { id: 2, name: "Motorista 2" },
    ];

    const historicoMock = {
      rides: [
        {
          id: 1,
          origin: "Rua A",
          destination: "Rua B",
          date: "2024-11-25T12:00:00Z",
          driver: { name: "Motorista 1" },
          distance: 10,
          duration: "30 min",
          value: 50.5,
        },
      ],
    };

    mockedAxios.get.mockResolvedValueOnce({ data: motoristasMock }); // Motoristas
    mockedAxios.get.mockResolvedValueOnce({ data: historicoMock }); // Histórico

    render(<HistoricoViagens />);

    // Verifica se os motoristas foram carregados no dropdown
    expect(await screen.findByText("Motorista 1")).toBeInTheDocument();

    // Simula o clique no botão "Aplicar Filtro"
    fireEvent.click(screen.getByText("Aplicar Filtro"));

    // Verifica se o histórico é exibido corretamente
    expect(await screen.findByText("Rua A")).toBeInTheDocument();
    expect(screen.getByText("Rua B")).toBeInTheDocument();
    expect(screen.getByText("Motorista 1")).toBeInTheDocument();
    expect(screen.getByText("10 km")).toBeInTheDocument();
    expect(screen.getByText("30 min")).toBeInTheDocument();
    expect(screen.getByText("R$50.50")).toBeInTheDocument();
  });

  it("deve exibir mensagem quando nenhum histórico for encontrado", async () => {
    mockedAxios.get.mockResolvedValueOnce({ data: [] }); // Motoristas
    mockedAxios.get.mockResolvedValueOnce({ data: { rides: [] } }); // Histórico vazio

    render(<HistoricoViagens />);

    fireEvent.click(screen.getByText("Aplicar Filtro"));

    expect(await screen.findByText("Nenhuma viagem encontrada.")).toBeInTheDocument();
  });
});
