import * as express from "express";
import { port } from "./config";
import * as cors from "cors";
import "./app";
const app = express();
const server = require("http").Server(app);

app.use(cors);

server.listen(port, () => {
  console.log(`started on port ${port}`);
});

export default server;
