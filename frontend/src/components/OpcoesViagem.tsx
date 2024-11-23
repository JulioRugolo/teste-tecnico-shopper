import React from "react";
import DriverCard from "./DriverCard";
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
  };
  onBack: () => void;
}

const OpcoesViagem = ({ data, onBack }: Props) => {
  const googleApiKey = process.env.REACT_APP_GOOGLE_API_KEY;

  try {
    const googleMapsUrl = `https://www.google.com/maps/embed/v1/directions?key=${googleApiKey}&origin=${data.origin.latitude},${data.origin.longitude}&destination=${data.destination.latitude},${data.destination.longitude}&mode=driving`;

    return (
      <>
        <h1>Opções de Viagem</h1>
        <button onClick={onBack}>Alterar Endereço</button>
        <p>Escolha um motorista para a sua viagem:</p>
        <div className="opcoes-container">
          <div className="map-container">
            <iframe title="mapa" src={googleMapsUrl} allowFullScreen></iframe>
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
              />
            ))}
          </div>
        </div>
      </>
    );
  } catch (error: any) {
    console.error("Erro ao carregar as opções de viagem:", error);

    Swal.fire({
      icon: "error",
      title: "Erro ao carregar dados",
      text: error.message || "Ocorreu um erro inesperado ao carregar as opções de viagem.",
      confirmButtonColor: "#3f51b5",
    });

    return (
      <div className="error-container">
        <h2>Ocorreu um erro ao carregar os dados!</h2>
        <button onClick={onBack} className="retry-button">
          Voltar e Tentar Novamente
        </button>
      </div>
    );
  }
};

export default OpcoesViagem;
