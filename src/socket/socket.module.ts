import { Module } from '@nestjs/common';
import { SocketGateway } from './socket.gateway';
import { SocketService } from './socket.service';
import { MessagesService } from './message.service';
import { MessageModule } from './message.module';

@Module({
  imports: [MessageModule],
  providers: [SocketGateway, SocketService],
})
export class SocketModule {}