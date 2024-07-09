const express = require("express");
const app = express();
const cors = require("cors");
const { secp256k1 } = require("ethereum-cryptography/secp256k1");
const { keccak256 } = require("ethereum-cryptography/keccak");
const { hexToBytes, toHex } = require("ethereum-cryptography/utils");
const port = 3042; // Define the port your server will run on

// Middleware setup
app.use(cors()); // Enable CORS for all routes
app.use(express.json()); // Parse JSON request bodies

// Initial balances for demo purposes
const balances = {
  "0xd574bf80ca2ec693ec8162e4375444f2588575823c144665be4763da4578c352": 100,
  "0x730b38781378f9509c9d4f64ed0a0a5846e5564bafbf01a9253a394b7e5fd39b": 50,
  "0xd1edb082770c3847ce40198f224476ea65d678fc32c1d15fcfc4a35476f19bc5": 75,
};

const privateKeys = {
  "0xd574bf80ca2ec693ec8162e4375444f2588575823c144665be4763da4578c352":
    "7f95f74c5aba6a3170cf04f39a06c769bf31d4189d212c33f735ac951caa220d",
  "0x730b38781378f9509c9d4f64ed0a0a5846e5564bafbf01a9253a394b7e5fd39b":
    "36fe6956a3affff87d4b818a9671bf2683cbdfef1da152dc1c0973afd042624c",
  "0xd1edb082770c3847ce40198f224476ea65d678fc32c1d15fcfc4a35476f19bc5":
    "ecd3ecee459e27896cf01add5216af72887dc5aaed9e3dbd9973a4fc672ad6cf",
};

// Route to get the balance of a specific address
app.get("/balance/:address", (req, res) => {
  const { address } = req.params; // Extract address from URL parameters
  const balance = balances[address] || 0; // Retrieve balance or default to 0
  const privateKey = privateKeys[address];

  if (privateKey) {
    res.send({ balance: balance.toString(), privateKey }); // Send back the balance as JSON
  } else {
    res
      .status(404)
      .send({ message: "Private key not found for the given address" });
  }
});

// Route to handle sending funds
app.post("/send", (req, res) => {
  try {
    const { signature, hexMessage, recoveryBit, sender, recipient, amount } =
      req.body; // Extract sender, recipient, and amount from the request body
    console.log("Received send request:", req.body);

    const signaturePublicKey = secp256k1.recoverPublicKey(
      hexToBytes(hexMessage),
      hexToBytes(signature),
      recoveryBit
    );

    const signatureAddressNotHex = keccak256(signaturePublicKey.slice(1)).slice(
      -20
    );
    const signatureAddress = "0x" + toHex(signatureAddressNotHex);

    if (signatureAddress !== sender) {
      return res.status(400).send({ message: "You are not the person!" });
    }

    // Ensure both sender and recipient have initial balances
    setInitialBalance(sender);
    setInitialBalance(recipient);

    // Check if the sender has enough funds
    if (balances[sender] < amount) {
      return res.status(400).send({ message: "Not enough funds!" });
    } else {
      // Update balances
      balances[sender] -= amount;
      balances[recipient] += amount;
      res.send({ balance: balances[sender].toString() }); // Send back the updated balance of the sender
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "An error occurred" });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Listening on port ${port}!`); // Corrected typo
});

// Helper function to set initial balance if not already present
function setInitialBalance(address) {
  if (!balances[address]) {
    balances[address] = 0;
  }
}
