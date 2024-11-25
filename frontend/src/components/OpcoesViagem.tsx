import React, { useState } from "react";
import DriverCard from "./DriverCard";
import HistoricoViagens from "./HistoricoViagens";
import Swal from "sweetalert2";
import "./OpcoesViagem.css";

interface Props {
  data: {
    origin: { latitude: number; longitude: number };
    destination: { latitude: number; longitude: number };
    options: {
      id: number;
      name: string;
      vehicle: string;
      review: { rating: number; comment: string };
      value: number;
    }[];
    distance: number;
    duration: string;
  };
  customerId: string;
  onBack: () => void;
}

const OpcoesViagem = ({ data, customerId, onBack }: Props) => {
  const [showHistorico, setShowHistorico] = useState(false);

  const googleApiKey = process.env.REACT_APP_GOOGLE_API_KEY;

  const exemploHistorico = [
    {
      id: 1,
      origem: "Rua A, 123",
      destino: "Av. B, 456",
      data: "2024-11-22",
      motorista: "Homer Simpson",
      valor: 111.11,
    },
    {
      id: 2,
      origem: "Praça C, 789",
      destino: "Rua D, 321",
      data: "2024-11-15",
      motorista: "Dominic Toretto",
      valor: 200.45,
    },
  ];

  const handleViagemConfirmada = () => {
    setShowHistorico(true);
  };

  return (
    <>
      <h1>{showHistorico ? "Histórico de Viagens" : "Opções de Viagem"}</h1>
      <button onClick={onBack}>
        {showHistorico ? "Voltar" : "Alterar Endereço"}
      </button>
      {showHistorico ? (
        <HistoricoViagens historico={exemploHistorico} />
      ) : (
        <>
          <p>Escolha um motorista para a sua viagem:</p>
          <div className="opcoes-container">
            <div className="map-container">
              {googleApiKey ? (
                <iframe
                  title="mapa"
                  src={`https://www.google.com/maps/embed/v1/directions?key=${googleApiKey}&origin=${data.origin.latitude},${data.origin.longitude}&destination=${data.destination.latitude},${data.destination.longitude}&mode=driving`}
                  allowFullScreen
                ></iframe>
              ) : (
                <p>
                  Erro ao carregar o mapa. Verifique sua conexão ou tente
                  novamente.
                </p>
              )}
            </div>
            <div className="drivers-list">
              {data.options.map((option) => (
                <DriverCard
                  key={option.id}
                  driver={{
                    id: option.id,
                    name: option.name,
                    vehicle: option.vehicle,
                    rating: option.review.rating,
                    comment: option.review.comment,
                    value: option.value,
                  }}
                  rideDetails={{
                    customer_id: customerId,
                    origin: `${data.origin.latitude},${data.origin.longitude}`,
                    destination: `${data.destination.latitude},${data.destination.longitude}`,
                    distance: data.distance,
                    duration: data.duration,
                  }}
                  onConfirm={handleViagemConfirmada}
                />
              ))}
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default OpcoesViagem;
