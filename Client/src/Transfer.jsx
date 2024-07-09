import { useEffect, useState } from "react";
/* A React hook that allows you to add state to functional components.
We use useState to create and manage local state variables for the component.*/
import server from "./server";
import { keccak256 } from "ethereum-cryptography/keccak";
import { utf8ToBytes, toHex, hexToBytes } from "ethereum-cryptography/utils";
import { secp256k1 } from "ethereum-cryptography/secp256k1";

function Transfer({ address, setBalance, privateKey }) {
  const [sendAmount, setSendAmount] = useState("");
  // The square brackets are a way to keep these pairs together. Think of them as holding hands. They tell us that each pair belongs together.
  const [recipient, setRecipient] = useState("");
  const [hashedMessage, setHashedMessage] = useState("");
  const [signature, setSignature] = useState("");
  const [sig, setSig] = useState("");
  const [recoveryBit, setRecoveryBit] = useState(0);



  const setValue = (setter) => (evt) => setter(evt.target.value);
  /* Higher-Order Functions
    A higher-order function is a function that either:
    -   Takes one or more functions as arguments, or
    -   Returns a function as its result. */
  async function hashAndSign(evt) {
    evt.preventDefault();
    try {
      if (!privateKey) {
        throw new Error("Private key is not defined");
      }
      const transactionMessage = {
        sender: address,
        amount: parseInt(sendAmount),
        recipient: recipient,
      };
      console.log("Transaction message:", transactionMessage);

      const hashedMessage = keccak256(
        utf8ToBytes(JSON.stringify(transactionMessage))
      );
      const hexMessage = toHex(hashedMessage);
      console.log("Hashed message:", hashedMessage);
      console.log("Hex message:", hexMessage);

      setHashedMessage(hexMessage);

      const signature = secp256k1.sign(hexMessage, privateKey);
      setSignature(signature);

      const sig = signature.r.toString(16) + signature.s.toString(16);
      setSig(sig);
      console.log("Signature:", sig);

      const recoveryBit = signature.recovery;
      setRecoveryBit(recoveryBit);
    } catch (error) {
      console.log(error);
    }
  }

  async function transfer(evt) {
    evt.preventDefault();

    try {
      if (!privateKey) {
        throw new Error("Private key is not defined");
      }
      const signatureString = {
        r: signature.r.toString(),
        s: signature.s.toString(),
      };

      const {
        data: { balance },
      } = await server.post(`send`, {
        sender: address,
        amount: parseInt(sendAmount),
        recipient,
        signature:signatureString,
        recoveryBit,
        hexMessage: hashedMessage,
      });
      setBalance(balance);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <form className="container transfer" onSubmit={transfer}>
      <h1>Send Transaction</h1>

      <label>
        Send Amount
        <input
          type="text"
          placeholder="1, 2, 3..."
          value={sendAmount}
          onChange={setValue(setSendAmount)}
        />
      </label>

      <label>
        Recipient
        <input
          type="text"
          placeholder="Type an address"
          value={recipient}
          onChange={setValue(setRecipient)}
        />
      </label>

      <button className="button" onClick={ (evt) =>  hashAndSign(evt)}>
        Sign your transaction
      </button>

      <div className="sign">
        <p>Your transcation hash: {hashedMessage}</p>
        <p>Your signature: {sig}</p>
        <p>
        Your recovery bit: {recoveryBit}
      </p>
      </div>

      <input type="submit" className="button" value="Transfer" />
    </form>
  );
}

export default Transfer;
