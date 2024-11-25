import React, { useState } from "react";
import SolicitarViagem from "./components/SolicitarViagem";
import OpcoesViagem from "./components/OpcoesViagem";

const App = () => {
  const [stage, setStage] = useState<"solicitar" | "opcoes">("solicitar");
  const [data, setData] = useState<any>(null);
  const [customerId, setCustomerId] = useState<string>("");

  const handleSubmitSolicitacao = (responseData: any) => {
    if (responseData?.options?.length > 0) {
      const generatedCustomerId =
        responseData.customerId || String(Math.floor(Math.random() * 10000));
      setData(responseData);
      setCustomerId(generatedCustomerId);
      setStage("opcoes");
    } else {
      alert("Nenhum motorista disponível para essa viagem.");
    }
  };

  const handleBackToSolicitacao = () => {
    setStage("solicitar");
  };

  return (
    <main>
      {stage === "solicitar" && (
        <SolicitarViagem onSubmit={handleSubmitSolicitacao} />
      )}
      {stage === "opcoes" && (
        <OpcoesViagem
          data={data}
          customerId={customerId}
          onBack={handleBackToSolicitacao}
        />
      )}
    </main>
  );
};

export default App;
