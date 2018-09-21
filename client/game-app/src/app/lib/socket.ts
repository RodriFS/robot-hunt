export class LocalSocket {
  private instance: Socket;
  player: String;

  static getInstance(...args) {
    if (!this.instance) {
      this.instance = new LocalSocket(...args);
    }
    return this.instance;
  }

  sendPlayerDataToGame(message) {
    this.player = message;
  }

  getPlayerDataFromSelectPlayer() {
    return this.player;
  }
}
