import React, { useState } from "react";
import axios from "axios";

interface Props {
  onSubmit: (data: any) => void;
}

const SolicitarViagem: React.FC<Props> = ({ onSubmit }) => {
  const [customerId, setCustomerId] = useState("");
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      const response = await axios.post("http://localhost:8080/api/ride/estimate", {
        customer_id: customerId,
        origin: origin,
        destination: destination,
      });

      onSubmit(response.data);
    } catch (error) {
      console.error("Erro ao estimar viagem:", error);
    }
  };

  return (
    <div>
      <h1>Solicitar Viagem</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>ID do Cliente:</label>
          <input
            type="text"
            value={customerId}
            onChange={(e) => setCustomerId(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Origem:</label>
          <input
            type="text"
            value={origin}
            onChange={(e) => setOrigin(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Destino:</label>
          <input
            type="text"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            required
          />
        </div>
        <button type="submit">Estimar Viagem</button>
      </form>
    </div>
  );
};

export default SolicitarViagem;
