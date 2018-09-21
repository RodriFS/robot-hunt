import { Component, OnInit } from '@angular/core';
import { GameService } from '../game.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-player-select',
  templateUrl: './player-select.component.html',
  styleUrls: ['./player-select.component.css']
})
export class PlayerSelectComponent implements OnInit {

  selectedPlayer1 = false;
  selectedPlayer2 = false;
  selectedLocalPlayer1 = false;
  selectedLocalPlayer2 = false;
  player1;
  player2;

  playerList: string[] = [];

  constructor(private gameSvc: GameService, private router: Router) {


    // gameSvc.announcePlayers$.subscribe(
    //   player => {
    //     this.playerList.push(`${player}`);
    //     console.log(this.playerList)
    //   });
  }

  ngOnInit() {
    this.gameSvc.getMessages();
    this.gameSvc.observable.subscribe(msg => {
      this.msg = this.gameSvc.subject.getValue();
      console.log(msg, this.msg);
      if (this.msg && this.msg.player === 'player1' && this.msg.status === true) {
        this.selectedPlayer1 = true;
      } else if (this.msg && this.msg.player === 'player2' && this.msg.status === true) {
        this.selectedPlayer2 = true;
      }
      if (this.selectedPlayer1 && this.selectedPlayer2) {
        this.router.navigate(['/game']);
      }
    });



  }


  onSelectPlayer1(): void {
    // this.gameSvc.broadcastPlayers('player1:' + this.selectedPlayer1);
    if (!this.selectedLocalPlayer2 && !this.selectedPlayer1) {
      this.gameSvc.sendMessage({
        player: 'player1',
        status: true
      });
      this.selectedPlayer1 = true;
      this.selectedLocalPlayer1 = true;
    }



  }

  onSelectPlayer2(): void {
    // this.gameSvc.broadcastPlayers('player2');
    if (!this.selectedLocalPlayer1 && !this.selectedPlayer2) {
      this.gameSvc.sendMessage({
        player: 'player2',
        status: true
      });
      this.selectedPlayer2 = true;
      this.selectedLocalPlayer2 = true;
    }
    if (this.selectedPlayer1 && this.selectedPlayer2) {
      this.router.navigate(['/game']);
    }

  }

  // onGoBack(): void {
  //   // this.selectedPlayer1 = false;
  //   // this.selectedLocalPlayer1 = false;
  //   // this.selectedPlayer2 = false;
  //   // this.selectedLocalPlayer2 = false;
  //   // this.gameSvc.sendMessage({
  //   //   player: 'player1',
  //   //   status: false
  //   // });
  //   // this.gameSvc.sendMessage({
  //   //   player: 'player2',
  //   //   status: false
  //   // });
  // }
  // postPlayer(): void {
  //   this.gameSvc.sendMessage();
  // }

  // getPlayers(): void {
  //   this.gameSvc.getPlayers()
  //     .subscribe(msg => console.log(msg));
  // }

}
