import { useState } from "react";
/* A React hook that allows you to add state to functional components.
We use useState to create and manage local state variables for the component.*/
import server from "./server";

function Transfer({ address, setBalance }) {
  const [sendAmount, setSendAmount] = useState("");
  // The square brackets are a way to keep these pairs together. Think of them as holding hands. They tell us that each pair belongs together.
  const [recipient, setRecipient] = useState("");

  const setValue = (setter) => (evt) => setter(evt.target.value);
  /* Higher-Order Functions
    A higher-order function is a function that either:
    -   Takes one or more functions as arguments, or
    -   Returns a function as its result. */

  async function transfer(evt) {
    evt.preventDefault(); // Prevents the default form submission behavior (which would reload the page).

    try {
      const {
        data: { balance },
      } = await server.post(`send`, {
        sender: address,
        amount: parseInt(sendAmount),
        recipient,
      });
      setBalance(blance);
    } catch (ex) {
      alert(ex.response.data.message);
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

      <input type="submit" className="button" value="Transfer" />
    </form>
  );
}

export default Transfer;
