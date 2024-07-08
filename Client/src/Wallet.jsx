import server from "./server";
// import * as secp from 'ethereum-cryptography/secp256k1'
import { secp256k1 } from "ethereum-cryptography/secp256k1";
import { toHex, utf8ToBytes } from "ethereum-cryptography/utils";
// import { sha256 } from "ethereum-cryptography/sha256.js";

function Wallet({
  address,
  setAddress,
  balance,
  setBalance,
  privateKey,
  setPrivateKey,
}) {
  //setaddress and setBalance are functions that update the address and balance state.
  // State in React:
  // State is a built-in React object that is used to store property values that belong to a component.
  // A component’s state can change over time, and when it does, React re-renders the component to reflect the new state in the UI.
  // State is local to the component and is not accessible to other components unless passed down through props.

  async function onChange(evt) {
    //onChange to handle the change event of the input field.
    //evt is an event object that contains information about the event that occurred (in this case, a change event on the input field).

    const privateKey = evt.target.value; //This line extracts the current value from the input field where the user types the wallet address and assigns it to the address variable.
    setPrivateKey(privateKey);
    const address = toHex(secp256k1.getPublicKey(privateKey));
    setAddress(address);
    if (address) {
      const {
        data: { balance },
      } = await server.get(`balance/${address}`);
      setBalance(balance);
    } else {
      setBalance(0);
    }
  }

  return (
    <div className="container Wallet">
      <h1>Your Wallet</h1>

      <label>
        Private Key
        <input
          type="text"
          placeholder="Type in a private key"
          value={privateKey}
          onChange={onChange}
        />
      </label>

      <div>Address: {address.slice(0, 10)}...</div>

      <div className="balance">Balance: {balance}</div>
    </div>
  );
}

export default Wallet;
