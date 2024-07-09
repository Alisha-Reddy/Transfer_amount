### CLIENT ###

server.js:
    -   The code imports the axios library.
    -   It creates a new Axios instance configured with http://localhost:3042 as the base URL.
    -   It then exports this instance as the default export of the module, so it can be easily imported and used in other parts of the application for making HTTP requests to the specified base URL.

Wallet.jsx: 
    Handles key generation and displays the private key, public key, and balance.
App.jsx: 
    Manages the state of keys and balance, and passes these states to Wallet and Transfer.
Transfer.jsx: 
    Signs the transaction using the private key and sends it to the server.
Server: 
    Verifies the signature and processes the transaction.



### Server ###

generate.js:
     generates the private key
