import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Message } from "./message.entity";

@Injectable()
export class MessagesService {
  constructor(
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>
  ) {}

  async findAll(): Promise<Message[]> {
    return await this.messageRepository.find();
  }

  async listByUserId(userId: string){
    return this.messageRepository.createQueryBuilder('message')
    .where('message.sender = :userId OR message.receiver = :userId', { userId })
    .getMany();

  }

  async createMessage(data: {
    sender: number;
    receiver: number;
    content: string;
    createdAt: Date;
  }) {
    let message = this.messageRepository.create(data);
    await this.messageRepository.save(message);
  }
}
