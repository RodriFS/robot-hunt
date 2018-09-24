import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import * as io from 'socket.io-client';
import { Socket } from './lib/socket';

@Injectable({
  providedIn: 'root'
})
export class GameService {
  // private url = 'http://rodrifs.local:5000';
  // private socket = io(this.url);
  private socket = Socket.getInstance();


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
    this.socket.socket.emit('players', message);
    this.socket.sendPlayerDataToGame(message);
  }

  getMessages() {
      this.socket.socket.on('start', (data) => {
        this.subject.next(data);

      });
  //     return () => {
  //       this.socket.disconnect();
  //     };
  //   });
  //   return observable;
  // }
 }
}
