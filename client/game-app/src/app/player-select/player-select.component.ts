import { Component, OnInit } from '@angular/core';
import { GameService } from '../game.service';
import { Router } from '@angular/router';
import { Socket } from '../lib/socket';

@Component({
  selector: 'app-player-select',
  templateUrl: './player-select.component.html',
  styleUrls: ['./player-select.component.css']
})
export class PlayerSelectComponent implements OnInit {

  private socket = Socket.getInstance();
  selectedPlayer1 = false;
  selectedPlayer2 = false;
  selectedLocalPlayer1 = false;
  selectedLocalPlayer2 = false;
  waiting = true;
  message = 'Waiting for second player...';
  player1;
  player2;

  playerList: string[] = [];

  constructor(private gameSvc: GameService, private router: Router) {}

  ngOnInit() {

    this.socket.socket.emit('waiting', 'waiting?');
    this.socket.socket.on('waiting', (data) => {
      this.waiting = data.waiting;
      this.message = data.message;

      if (data.reconnect) {
        this.socket.socket.disconnect();
            // console.log(this)
        this.socket = this.socket.reconnectSocket();
        setTimeout(() => {
            window.location.reload();
        }, 3000);

      }

    });

    this.socket.socket.on('start', (data) => {
      if (data && data.player === 'player1' && data.status === true) {
          this.selectedPlayer1 = true;
        } else if (data && data.player === 'player2' && data.status === true) {
          this.selectedPlayer2 = true;
        }
        if (this.selectedPlayer1 && this.selectedPlayer2) {

          this.router.navigate(['/game']);
        }
    });
  }


  onSelectPlayer1(): void {
    if (!this.selectedLocalPlayer2 && !this.selectedPlayer1) {
      const message = {
        player: 'player1',
        status: true,
      };
      this.socket.socket.emit('start', message);
      this.socket.sendPlayerDataToGame(message);
      this.selectedPlayer1 = true;
      this.selectedLocalPlayer1 = true;
    }
  }

  onSelectPlayer2(): void {
    if (!this.selectedLocalPlayer1 && !this.selectedPlayer2) {
      const message = {
        player: 'player2',
        status: true,
      };
      this.socket.socket.emit('start', message);
      this.socket.sendPlayerDataToGame(message);
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
