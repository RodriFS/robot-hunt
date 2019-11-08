import { Component, OnInit } from "@angular/core";
import { loadGame } from "../scripts/game";
import { GameService } from "../game.service";
import { Router } from "@angular/router";
import Socket from "../lib/socket";

@Component({
  selector: "app-in-game",
  templateUrl: "./in-game.component.html",
  styleUrls: ["./in-game.component.css"],
})
export class InGameComponent implements OnInit {
  public socket = Socket.getInstance();

  constructor(public gameSvc: GameService, public router: Router) {}

  playerName;
  game;

  ngOnInit() {
    this.socket.socket.on("waiting", (data) => {
      if (data.waiting) {
        this.router.navigate(["/"]);
      }
      this.socket.socket.emit("waiting", data);
    });

    try {
      this.playerName = this.socket.getPlayerDataFromSelectPlayer().player;
      this.game = loadGame();
    } catch {
      this.router.navigate(["/"]);
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    }
  }
}
