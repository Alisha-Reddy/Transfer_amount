import Wallet from "./Wallet";
import Transfer from "./Transfer";
import "./App.css";
import { useEffect, useState } from "react";

function App() {
  const [balance, setBalance] = useState(0);
  const [address, setAddress] = useState("");
  const [privateKey, setPrivateKey] = useState("");

  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const {data} = await server.get(`balance/${address}`)
  //     }
  //   }
  // })

  return (
    <div className="app">
      <Wallet
        balance={balance}
        setBalance={setBalance}
        address={address}
        setAddress={setAddress}
        privateKey={privateKey}
        setPrivateKey={setPrivateKey}
      />
      <Transfer setBalance={setBalance} address={setAddress} privateKey={privateKey} setPrivateKey={setPrivateKey}></Transfer>
    </div>
  );
}

export default App;
