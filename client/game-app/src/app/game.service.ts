import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import * as io from 'socket.io-client';
import { LocalSocket } from './lib/socket';

@Injectable({
  providedIn: 'root'
})
export class GameService {
  private url = 'http://localhost:5000';
  private socket = io(this.url);
  private localSocket = LocalSocket.getInstance();


  private prevmsg;

  private subject = new BehaviorSubject(this.prevmsg);
  private observable = this.subject.asObservable();
  // private announcePlayersSource = new Subject<string>();
  // announcePlayers$ = this.announcePlayersSource.asObservable();
  //
  // broadcastPlayers(player: string) {
  //   this.announcePlayersSource.next(player);
  // }

  sendMessage(message) {
    this.socket.emit('players', message);
    this.localSocket.sendPlayerDataToGame(message);
  }

  getMessages() {
      this.socket.on('start', (data) => {
        this.subject.next(data);

      });
  //     return () => {
  //       this.socket.disconnect();
  //     };
  //   });
  //   return observable;
  // }
}
