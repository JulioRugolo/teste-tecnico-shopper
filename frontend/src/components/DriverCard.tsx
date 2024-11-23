import React from "react";
import "./DriverCard.css";

interface Props {
  driver: {
    id: number;
    name: string;
    vehicle: string;
    rating: number;
    comment: string;
    value: number;
  };
}

const DriverCard: React.FC<Props> = ({ driver }) => {
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
        <button>Escolher</button>
      </div>
    </div>
  );
};

export default DriverCard;
