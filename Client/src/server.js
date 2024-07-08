// axios: provides a simple API to make HTTP requests such as GET, POST, PUT, DELETE, and others. These requests are essential for interacting with servers, such as fetching data from a REST API or submitting form data.
import axios from "axios";

const server = axios.create({
  baseURL: "http://localhost:5173",
  // baseURL: A configuration option that sets a base URL for all requests made using this instance. When making a request, if you provide a relative URL, it will be appended to the baseURL.
});

export default server;
