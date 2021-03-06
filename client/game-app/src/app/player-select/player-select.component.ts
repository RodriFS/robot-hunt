import { Component, OnInit } from "@angular/core";
import { GameService } from "../game.service";
import { Router } from "@angular/router";
import Socket from "../lib/socket";

@Component({
  selector: "app-player-select",
  templateUrl: "./player-select.component.html",
  styleUrls: ["./player-select.component.css"],
})
export class PlayerSelectComponent implements OnInit {
  public socketInstance = Socket.getInstance();
  selectedPlayer1 = false;
  selectedPlayer2 = false;
  selectedLocalPlayer1 = false;
  selectedLocalPlayer2 = false;
  waiting = true;
  message = "";
  player1;
  player2;

  playerList: string[] = [];

  constructor(public gameSvc: GameService, public router: Router) {}

  ngOnInit() {
    const socket = this.socketInstance.socket;
    socket.emit("waiting", "waiting?");
    socket.on("waiting", (data) => {
      this.waiting = data.waiting;
      this.message = data.message;

      if (data.reconnect) {
        socket.disconnect();
        this.socketInstance = this.socketInstance.reconnectSocket();
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      }
    });

    socket.on("start", (data) => {
      if (data && data.player === "player1" && data.status === true) {
        this.selectedPlayer1 = true;
      } else if (data && data.player === "player2" && data.status === true) {
        this.selectedPlayer2 = true;
      }
      if (this.selectedPlayer1 && this.selectedPlayer2) {
        this.router.navigate(["/game"]);
      }
    });
  }

  onSelectPlayer1(): void {
    if (!this.selectedLocalPlayer2 && !this.selectedPlayer1) {
      const message = {
        player: "player1",
        status: true,
      };
      this.socketInstance.socket.emit("start", message);
      this.socketInstance.sendPlayerDataToGame(message);
      this.selectedPlayer1 = true;
      this.selectedLocalPlayer1 = true;
    }
  }

  onSelectPlayer2(): void {
    if (!this.selectedLocalPlayer1 && !this.selectedPlayer2) {
      const message = {
        player: "player2",
        status: true,
      };
      this.socketInstance.socket.emit("start", message);
      this.socketInstance.sendPlayerDataToGame(message);
      this.selectedPlayer2 = true;
      this.selectedLocalPlayer2 = true;
    }
  }

  resetPlayers(waiting): void {
    if (waiting) {
      this.selectedPlayer1 = false;
      this.selectedLocalPlayer1 = false;
      this.selectedPlayer2 = false;
      this.selectedLocalPlayer2 = false;
    }
  }
}
