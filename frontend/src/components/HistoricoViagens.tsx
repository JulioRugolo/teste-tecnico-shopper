import React, { useEffect, useState } from "react";
import axios from "axios";
import "./HistoricoViagens.css";

interface Viagem {
  id: number;
  origem: string;
  destino: string;
  data: string;
  motorista: string;
  distancia: number;
  tempo: string;
  valor: number;
}

interface Motorista {
  id: number;
  name: string;
}

const HistoricoViagens: React.FC = () => {
  const [userId, setUserId] = useState<number>(1);
  const [motoristas, setMotoristas] = useState<Motorista[]>([]);
  const [selectedDriver, setSelectedDriver] = useState<string>("");
  const [historico, setHistorico] = useState<Viagem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMotoristas = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/drivers");
        setMotoristas(response.data);
      } catch (err: any) {
        console.error("Erro ao buscar motoristas:", err);
        setError("Erro ao carregar a lista de motoristas.");
      }
    };

    fetchMotoristas();
  }, []);

  const fetchHistorico = async () => {
    setLoading(true);
    setError(null);

    try {
      const queryParams = selectedDriver
        ? `?driver_id=${selectedDriver}`
        : "";

      const response = await axios.get(
        `http://localhost:8080/api/ride/${userId}${queryParams}`
      );

      const formattedData: Viagem[] = response.data.rides.map((ride: any) => ({
        id: ride.id,
        origem: ride.origin,
        destino: ride.destination,
        data: new Date(ride.date).toLocaleString("pt-BR"),
        motorista: ride.driver.name,
        distancia: ride.distance,
        tempo: ride.duration,
        valor: ride.value,
      }));

      setHistorico(formattedData);
    } catch (err: any) {
      console.error("Erro ao buscar o histórico:", err);
      setError("Erro ao carregar o histórico de viagens.");
    } finally {
      setLoading(false);
    }
  };

  const handleFilter = () => {
    fetchHistorico();
  };

  return (
    <div className="historico-viagens">
      <h1>Histórico de Viagens</h1>

      <div className="filters">
        <div>
          <label>
            ID do Usuário:
            <input
              type="number"
              value={userId}
              onChange={(e) => setUserId(Number(e.target.value))}
              placeholder="Digite o ID do usuário"
            />
          </label>
        </div>

        <div>
          <label>
            Motorista:
            <select
              value={selectedDriver}
              onChange={(e) => setSelectedDriver(e.target.value)}
            >
              <option value="">Mostrar todos</option>
              {motoristas.map((motorista) => (
                <option key={motorista.id} value={motorista.id}>
                  {motorista.name}
                </option>
              ))}
            </select>
          </label>
        </div>

        <button onClick={handleFilter}>Aplicar Filtro</button>
      </div>

      {loading ? (
        <p>Carregando...</p>
      ) : error ? (
        <p className="error">{error}</p>
      ) : historico.length > 0 ? (
        <ul>
          {historico.map((viagem) => (
            <li key={viagem.id}>
              <div>
                <strong>Data e Hora:</strong> {viagem.data}
              </div>
              <div>
                <strong>Origem:</strong> {viagem.origem}
              </div>
              <div>
                <strong>Destino:</strong> {viagem.destino}
              </div>
              <div>
                <strong>Motorista:</strong> {viagem.motorista}
              </div>
              <div>
                <strong>Distância:</strong> {viagem.distancia} km
              </div>
              <div>
                <strong>Tempo:</strong> {viagem.tempo}
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
