import * as io from 'socket.io-client';

export class Socket {
  public url = 'http://rodrifs.local:5000';
  public socket = io.connect(
    this.url,
    { reconnection: true, reconnectionDelay: 1000, forceNew: true }
  );
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
