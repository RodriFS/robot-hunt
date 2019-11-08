import { Injectable } from "@angular/core";
import { Observable, BehaviorSubject } from "rxjs";
import { map } from "rxjs/operators";
import * as io from "socket.io-client";
import Socket from "./lib/socket";

@Injectable({
  providedIn: "root",
})
export class GameService {}
