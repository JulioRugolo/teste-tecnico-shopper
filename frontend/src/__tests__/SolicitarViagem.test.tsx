import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import Swal from "sweetalert2";
import SolicitarViagem from "../components/SolicitarViagem";

jest.mock("sweetalert2");

describe("SolicitarViagem", () => {
  const mockAxios = new MockAdapter(axios);
  const mockOnSubmit = jest.fn();

  afterEach(() => {
    mockAxios.reset();
    jest.clearAllMocks();
  });

  it("deve exibir os campos do formulário corretamente", () => {
    render(<SolicitarViagem onSubmit={mockOnSubmit} />);

    expect(screen.getByLabelText(/Nome:/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Origem:/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Destino:/i)).toBeInTheDocument();
    expect(screen.getByText(/Estimar Viagem/i)).toBeInTheDocument();
  });

  it("deve enviar o formulário com sucesso quando os dados estão corretos", async () => {
    mockAxios.onPost("http://localhost:8080/api/ride/estimate").reply(200, {
      options: [{ id: 1, name: "Motorista Teste" }],
    });

    render(<SolicitarViagem onSubmit={mockOnSubmit} />);

    fireEvent.change(screen.getByLabelText(/Nome:/i), {
      target: { value: "Cliente Teste" },
    });
    fireEvent.change(screen.getByLabelText(/Origem:/i), {
      target: { value: "Rua A" },
    });
    fireEvent.change(screen.getByLabelText(/Destino:/i), {
      target: { value: "Rua B" },
    });

    fireEvent.click(screen.getByText(/Estimar Viagem/i));

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        options: [{ id: 1, name: "Motorista Teste" }],
      });
    });
  });

  it("deve exibir uma mensagem de erro quando não há motoristas disponíveis", async () => {
    mockAxios.onPost("http://localhost:8080/api/ride/estimate").reply(200, {
      options: [],
    });

    render(<SolicitarViagem onSubmit={mockOnSubmit} />);

    fireEvent.change(screen.getByLabelText(/Nome:/i), {
      target: { value: "Cliente Teste" },
    });
    fireEvent.change(screen.getByLabelText(/Origem:/i), {
      target: { value: "Rua A" },
    });
    fireEvent.change(screen.getByLabelText(/Destino:/i), {
      target: { value: "Rua B" },
    });

    fireEvent.click(screen.getByText(/Estimar Viagem/i));

    await waitFor(() => {
      expect(Swal.fire).toHaveBeenCalledWith({
        icon: "error",
        title: "Erro ao estimar viagem",
        text: "Ocorreu um erro inesperado. Tente novamente.",
        confirmButtonColor: "#3f51b5",
      });
    });
  });

  it("deve exibir uma mensagem de erro quando ocorre um erro inesperado", async () => {
    mockAxios.onPost("http://localhost:8080/api/ride/estimate").networkError();

    render(<SolicitarViagem onSubmit={mockOnSubmit} />);

    fireEvent.change(screen.getByLabelText(/Nome:/i), {
      target: { value: "Cliente Teste" },
    });
    fireEvent.change(screen.getByLabelText(/Origem:/i), {
      target: { value: "Rua A" },
    });
    fireEvent.change(screen.getByLabelText(/Destino:/i), {
      target: { value: "Rua B" },
    });

    fireEvent.click(screen.getByText(/Estimar Viagem/i));

    await waitFor(() => {
      expect(Swal.fire).toHaveBeenCalledWith({
        icon: "error",
        title: "Erro ao estimar viagem",
        text: "Ocorreu um erro inesperado. Tente novamente.",
        confirmButtonColor: "#3f51b5",
      });
    });
  });
});
