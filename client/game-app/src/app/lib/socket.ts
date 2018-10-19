import * as io from 'socket.io-client';

export class Socket {
  private url = 'http://rodrifs.local:5000';
  private socket = io.connect(
    this.url,
    { reconnection: true, reconnectionDelay: 1000, forceNew: true }
  );
  private instance: Socket;
  player: String;

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
