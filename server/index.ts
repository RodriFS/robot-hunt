import * as express from "express";
import { port } from "./config";
import * as cors from "cors";

const app = express();
const server = require("http").createServer(app);
import socketConnection from "./app";
socketConnection(server);

const allowedOrigins = {
  origin: "http://localhost:4200",
  optionsSuccessStatus: 200,
  credentials: true,
};

app.use(cors(allowedOrigins));

app.get("/", function(req, res) {
  res.send("<h1>Hello world</h1>");
});

server.listen(port, () => {
  console.log(`started on port ${port}`);
});

export default server;
