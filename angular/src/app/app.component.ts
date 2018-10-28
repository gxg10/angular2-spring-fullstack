import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  private baseUrl: string = 'http://localhost:8080';

  constructor(private http: HttpClient) {}

  public submitted: boolean;
  roomsearch: FormGroup;
  rooms: Room[];
  request:ReserveRoomRequest;
  currentCheckin: string;
  currentCheckout: string;

  ngOnInit() {
    this.roomsearch = new FormGroup({
      checkin: new FormControl(''),
      checkout: new FormControl('')
    });
    const roomsearchValueChanges$ = this.roomsearch.valueChanges;
    roomsearchValueChanges$.subscribe(
      valChange => {
        this.currentCheckin = valChange.checkin;
        this.currentCheckout = valChange.checkout;
      }
    )
  }

  onSubmit({value, valid}: {value: Roomsearch, valid: boolean}) {
    console.log(value);
    this.getAll()
    .subscribe(
      data => {
        this.rooms = data.content;
        console.log(data.content);
      }
    );
  }

  reserveRoom(value:string) {
    console.log('room id for reservartion : ' + value);
    this.request = new ReserveRoomRequest(value,
       this.currentCheckin, this.currentCheckout);
       this.createReservation(this.request);
  }

  createReservation(body: ReserveRoomRequest) {
    const httpOptions = {
      headers : new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    this.http.post(this.baseUrl + '/room/reservation/v1',
    body, httpOptions).subscribe(res => {
      console.log(res);
    });
  }

  getAll(): Observable<any> {

    return this.http.get(this.baseUrl + '/room/reservation/v1?checkin=' + 
    this.currentCheckin + '&checkout=' + this.currentCheckout);
  }

}

export interface Roomsearch {
  checkin: string;
  checkout: string;
}

export interface Room {
  id: string;
  roomNumber: string;
  price: string;
  links: string;
}

export class ReserveRoomRequest {
  roomId: string;
  checkin: string;
  checkout: string;

  constructor(roomId: string,
    checkin: string,
    checkout: string) {
      this.roomId = roomId;
      this.checkin = checkin;
      this.checkout = checkout;
    }
}