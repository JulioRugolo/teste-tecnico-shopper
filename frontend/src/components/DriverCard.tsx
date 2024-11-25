import React from "react";
import axios from "axios";
import "./DriverCard.css";
import Swal from "sweetalert2";

interface Props {
  driver: {
    id: number;
    name: string;
    vehicle: string;
    rating: number;
    comment: string;
    value: number;
  };
  rideDetails: {
    customer_id: string;
    origin: string;
    destination: string;
    distance: number;
    duration: string;
  }; // Adiciona detalhes da viagem como prop
}

const DriverCard: React.FC<Props> = ({ driver, rideDetails }) => {
  const handleChooseDriver = async () => {
    try {
      const response = await axios.patch("http://localhost:8080/api/ride/confirm", {
        customer_id: rideDetails.customer_id,
        origin: rideDetails.origin,
        destination: rideDetails.destination,
        distance: rideDetails.distance,
        duration: rideDetails.duration,
        driver: { id: driver.id, name: driver.name },
        value: driver.value,
      });

      if (response.status === 200) {
        await Swal.fire({
          icon: "success",
          title: "Viagem confirmada!",
          text: "Aproveite sua viagem!",
        });
      }
    } catch (error: any) {
      console.error("Erro ao confirmar a viagem:", error.message || error);
      alert("Erro ao confirmar a viagem. Tente novamente mais tarde.");
    }
  };

  return (
    <div className="driver-card">
      <div className="card-header">
        <h2>{driver.name}</h2>
        <p className="vehicle">Veículo: {driver.vehicle}</p>
      </div>
      <div className="card-body">
        <div className="rating">
          <p>Avaliação:</p>
          <span>{driver.rating} ⭐</span>
        </div>
        <div className="comment">
          <p>Comentário:</p>
          <span>{driver.comment}</span>
        </div>
        <div className="price">
          <p>Valor:</p>
          <span>R${driver.value.toFixed(2)}</span>
        </div>
      </div>
      <div className="card-footer">
        <button onClick={handleChooseDriver}>Escolher</button>
      </div>
    </div>
  );
};

export default DriverCard;
