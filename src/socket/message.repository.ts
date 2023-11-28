// src/messages/message.repository.ts
import { EntityRepository, Repository } from 'typeorm';
import { Message } from './message.entity';

@EntityRepository(Message)
export class MessageRepository extends Repository<Message> {
  // async createMessage(sender: string, receiver: string, content: string, createdAt: Date): Promise<Message> {
  //   const message = this.create({ sender, receiver, content, createdAt });
  //   return this.save(message);
  // }
}