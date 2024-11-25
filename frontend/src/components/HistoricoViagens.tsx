import React from "react";
import "./HistoricoViagens.css";

interface Props {
  historico: {
    id: number;
    origem: string;
    destino: string;
    data: string;
    motorista: string;
    valor: number;
  }[];
}

const HistoricoViagens: React.FC<Props> = ({ historico }) => {
  return (
    <div className="historico-viagens">
      <h1>Histórico de Viagens</h1>
      {historico.length > 0 ? (
        <ul>
          {historico.map((viagem) => (
            <li key={viagem.id}>
              <div>
                <strong>Origem:</strong> {viagem.origem}
              </div>
              <div>
                <strong>Destino:</strong> {viagem.destino}
              </div>
              <div>
                <strong>Data:</strong> {viagem.data}
              </div>
              <div>
                <strong>Motorista:</strong> {viagem.motorista}
              </div>
              <div>
                <strong>Valor:</strong> R${viagem.valor.toFixed(2)}
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p>Nenhuma viagem encontrada.</p>
      )}
    </div>
  );
};

export default HistoricoViagens;
