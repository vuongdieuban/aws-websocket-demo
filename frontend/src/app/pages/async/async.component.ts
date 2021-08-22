import { Component, OnInit } from '@angular/core';
import { SocketService } from 'src/app/services/socket/socket.service';

@Component({
  selector: 'app-async',
  templateUrl: './async.component.html',
  styleUrls: ['./async.component.scss'],
})
export class AsyncComponent implements OnInit {
  constructor(private readonly socketService: SocketService) {}

  ngOnInit(): void {
    this.socketService.initSocket();
  }
}
