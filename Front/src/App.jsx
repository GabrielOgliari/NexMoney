import { useState } from "react";
// import reactLogo from "./assets/react.svg"; // Removido pois o arquivo não está presente
import viteLogo from "/vite.svg";
import "./App.css";

export function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        {/* <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a> */}
      </div>
      <h1>NexMoney</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          Contador: {count}
        </button>
        <p>
          Edite <code>src/app.jsx</code> e salve para testar o HMR.
        </p>
      </div>
      <p className="read-the-docs">
        Clique nos logos para saber mais sobre as tecnologias.
      </p>
    </>
  );
}
