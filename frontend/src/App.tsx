import React, { useState } from "react";
import SolicitarViagem from "./components/SolicitarViagem";
import OpcoesViagem from "./components/OpcoesViagem";

const App = () => {
  const [stage, setStage] = useState<"solicitar" | "opcoes">("solicitar");
  const [data, setData] = useState<any>(null);

  const handleSubmitSolicitacao = (responseData: any) => {
    setData(responseData);
    setStage("opcoes");
  };

  return (
    <main>
      {stage === "solicitar" && (
        <SolicitarViagem onSubmit={handleSubmitSolicitacao} />
      )}
      {stage === "opcoes" && <OpcoesViagem data={data} />}
    </main>
  );
};

export default App;
