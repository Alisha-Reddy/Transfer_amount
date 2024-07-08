const express = require("express");
const app = express();
const cors = require("cors");
const port = 3042; // Define the port your server will run on

// Middleware setup
app.use(cors()); // Enable CORS for all routes
app.use(express.json()); // Parse JSON request bodies

// Initial balances for demo purposes
const balances = {
  "a97a1d1ec67b946817b82e211646a3c799f57e8be320a26c86eca5d1f47c5f47": 25,
  "9d1b8cb967d2e87336938a8cc2e309a41d5b835c33bf08755fa352ac999c29da": 50,
  "e8ef74d80cfc35399879c7513808d07df098507cd9fa3bd59e22259aac33b557": 75,
};

// Route to get the balance of a specific address
app.get("/balance/:address", (req, res) => {
  const { address } = req.params; // Extract address from URL parameters
  const balance = balances[address] || 0; // Retrieve balance or default to 0
  res.send({ balance }); // Send back the balance as JSON
});

// Route to handle sending funds
app.post("/send", (req, res) => {
  // TODO: get a signature from the client-side application
  // Recover the public address from the signature

  const { sender, recipient, amount } = req.body; // Extract sender, recipient, and amount from the request body

  // Ensure both sender and recipient have initial balances
  setInitialBalance(sender);
  setInitialBalance(recipient);

  // Check if the sender has enough funds
  if (balances[sender] < amount) {
    res.status(400).send({ message: "Not enough funds!" });
  } else {
    // Update balances
    balances[sender] -= amount;
    balances[recipient] += amount;
    res.send({ balance: balances[sender] }); // Send back the updated balance of the sender
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
