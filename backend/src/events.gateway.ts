import { Logger } from '@nestjs/common';
import { WebSocketGateway, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { EventsPublisher } from './events-publisher';

@WebSocketGateway()
export class EventsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  private readonly logger: Logger = new Logger('EventsGateway');
  private TxDataStreamEventName = 'tx-data';

  private readonly connectedSockets = new Map<string, Socket[]>();

  constructor(private readonly eventsPublisher: EventsPublisher) {
    this.eventsPublisher.txStream$.subscribe(data => {
      const sockets = this.connectedSockets.get(data.clientId);
      if (!sockets) {
        return;
      }
      sockets.forEach(socket => socket.emit(this.TxDataStreamEventName, data));
    });
  }

  public handleDisconnect(socket: Socket) {
    try {
      const clientId = socket.handshake.query['clientId'] as string;
      if (!clientId) {
        throw new Error('ClientId is required');
      }
      this.removeSocketFromClient(clientId, socket);
    } catch (err) {
      this.processWSError(err, socket);
    }
  }

  async handleConnection(socket: Socket) {
    try {
      const clientId = socket.handshake.query['clientId'] as string;
      if (!clientId) {
        throw new Error('ClientId is required');
      }
      this.addSocketToClient(clientId, socket);
    } catch (err) {
      this.processWSError(err, socket);
    }
  }

  private addSocketToClient(clientId: string, socket: Socket) {
    const clientSockets = this.connectedSockets.get(clientId);
    if (clientSockets) {
      clientSockets.push(socket);
    } else {
      this.connectedSockets.set(clientId, [socket]);
    }
  }

  private removeSocketFromClient(clientId: string, socket: Socket) {
    const clientSockets = this.connectedSockets.get(clientId);
    if (!(clientSockets && clientSockets.length)) {
      return;
    }

    const disconnectSocketId = socket.id;
    const updatedClientSockets = clientSockets.filter(s => s.id !== disconnectSocketId);
    this.connectedSockets.set(clientId, updatedClientSockets);
  }

  private processWSError(err: Error, socket: Socket) {
    socket.emit('exception', {
      status: 'Error',
      errorType: err.name,
      message: err.message,
    });
  }
}
