import React, { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import "./SolicitarViagem.css";

interface Props {
  onSubmit: (data: any) => void;
}

const SolicitarViagem = ({ onSubmit }: Props) => {
  const [customerId, setCustomerId] = useState("");
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:8080/api/ride/estimate",
        {
          customer_id: customerId,
          origin: origin,
          destination: destination,
        }
      );

      if (response.data?.options?.length > 0) {
        onSubmit(response.data);
      } else {
        throw new Error("Nenhum motorista disponível.");
      }
    } catch (error: any) {

      Swal.fire({
        icon: "error",
        title: "Erro ao estimar viagem",
        text:
          error.response?.data?.message ||
          "Ocorreu um erro inesperado. Tente novamente.",
        confirmButtonColor: "#3f51b5",
      });
    }
  };

  return (
    <div className="solicitar-container">
      <h1 className="solicitar-title">Solicitar Viagem</h1>
      <form className="solicitar-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="customerId">Nome:</label>
          <input
            id="customerId"
            type="text"
            value={customerId}
            onChange={(e) => setCustomerId(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="origin">Origem:</label>
          <input
            id="origin"
            type="text"
            value={origin}
            onChange={(e) => setOrigin(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="destination">Destino:</label>
          <input
            id="destination"
            type="text"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            required
          />
        </div>
        <button className="submit-button" type="submit">
          Estimar Viagem
        </button>
      </form>
    </div>
  );
};

export default SolicitarViagem;
