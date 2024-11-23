import React from "react";

interface Props {
  data: any;
}

const OpcoesViagem = ({ data }: Props) => {
  const googleApiKey = process.env.GOOGLE_API_KEY;

  // URL do Google Maps Directions
  const googleMapsUrl = `https://www.google.com/maps/embed/v1/directions?key=${googleApiKey}&origin=${data.origin.latitude},${data.origin.longitude}&destination=${data.destination.latitude},${data.destination.longitude}&mode=driving`;

  return (
    <div>
      <h1>Opções de Viagem</h1>
      <iframe
        title="mapa"
        src={googleMapsUrl}
        width="600"
        height="450"
        style={{ border: 0 }}
        allowFullScreen
      ></iframe>
      <ul>
        {data.options.map((option: any) => (
          <li key={option.id}>
            <h2>{option.name}</h2>
            <p>{option.description}</p>
            <p>Veículo: {option.vehicle}</p>
            <p>Avaliação: {option.review.rating}</p>
            <p>Comentário: {option.review.comment}</p>
            <p>Valor: R${option.value.toFixed(2)}</p>
            {/* O botão "Escolher" agora não faz nada */}
            <button>Escolher</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default OpcoesViagem;
