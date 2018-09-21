import { Component, OnInit } from '@angular/core';
import Phaser from 'phaser';
const data_json = require('../../assets/map.json');
import { loadGame } from '../scripts/game';
import { PlayerSelectComponent } from '../player-select/player-select.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-in-game',
  templateUrl: './in-game.component.html',
  styleUrls: ['./in-game.component.css']
})
export class InGameComponent implements OnInit {

  // constructor(private playerSelect: PlayerSelectComponent, private router: Router) {
    // console.log(this.playerSelect)
    // if (!this.playerSelect.selectedPlayer1 || !this.playerSelect.selectedPlayer2) {
    //   this.router.navigate(['/select']);
    // }
  // }

  ngOnInit() {
    this.game = loadGame();
  }
}
