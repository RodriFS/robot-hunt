import * as io from "socket.io-client";
import { environment } from "../../environments/environment";

export default class Socket {
  public socket = io(environment.serverApi, {
    reconnection: true,
    reconnectionDelay: 1000,
    forceNew: true,
  });

  public static instance: Socket;
  player;

  static getInstance(...args) {
    if (!this.instance) {
      this.instance = new Socket();
    }
    return this.instance;
  }

  sendPlayerDataToGame(message) {
    this.player = message;
  }

  getPlayerDataFromSelectPlayer() {
    return this.player;
  }

  reconnectSocket() {
    return new Socket();
  }
}
