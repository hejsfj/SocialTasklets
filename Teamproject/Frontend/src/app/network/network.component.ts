import { Component, OnInit } from '@angular/core';
import { Friendship } from './friendship'

var conf = require('../../../config.json');
var socket = require('socket.io-client')('http://localhost:' + conf.ports.sfbroker_socket);

@Component({
  selector: 'app-network',
  templateUrl: './network.component.html',
  styleUrls: ['./network.component.css']
})

export class NetworkComponent implements OnInit {

  constructor() { }

  ngOnInit() {
      //get friends
      console.log(socket.emit('SFB_User_ID_Info', 8080));

      //get all users
      console.log(socket.emit('SFRead_User'));
  }

  //requested confirmed


  friendships = [
    new Friendship('Sebastian', 'Sammer', 'accepted'),
    new Friendship('Sebastian', 'Erda', 'none'),
    new Friendship('Sebastian', 'Alex', 'accepted'),
    new Friendship('Sebastian', 'Daniel', 'pending'),
    new Friendship('Sebastian', 'Philipp', 'accepted'),
  ];

  getFriends(): Friendship[] {
    return this.friendships.filter(friendship => friendship.status === 'accepted' || friendship.status === 'pending');
  }

  getNetwork(): Friendship[] {
    return this.friendships.filter(friendship => friendship.status === 'none');
  }

  addFriend(user) {

    var friendshipsLength = this.friendships.length;

    for (var i = 0; i < friendshipsLength; i++) {
      if(this.friendships[i].user2 === user){
        this.friendships[i].status = 'accepted';
      }
    }
  }

  deleteFriend(user) {

    var friendshipsLength = this.friendships.length;

    for (var i = 0; i < friendshipsLength; i++) {
      if(this.friendships[i].user2 === user){
        this.friendships[i].status = 'none';
      }
    }
  }

}
