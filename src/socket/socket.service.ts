import { Injectable } from "@nestjs/common";
import { Socket } from "socket.io";
import { MessagesService } from "./message.service";

@Injectable()
export class SocketService {
  private readonly connectedClients: Map<string, Socket> = new Map();
  constructor(private readonly messageService: MessagesService) {}

  handleConnection(socket: Socket): void {
    const clientId = socket.id;
    this.connectedClients.set(clientId, socket);

    socket.on("disconnect", () => {
      this.connectedClients.delete(clientId);
    });

    // Handle other events and messages from the client
    // socket.on('alert', (data) => {
    //   console.log("data received: ", data.message)
    // });

    setInterval(() => {
      socket.emit("alert", `Hello client`);
    }, 30000);

    socket.on("user/create_order_success", (data) => {
      this.handleCreateOrderSuccess(socket, data);
    });

    socket.on("user/received_order_success", (data) => {
      this.handleReceivedOrderSuccess(socket, data);
    });

    socket.on("driver/received_order_success", (data) => {
      this.handleDriverReceivedOrderSuccess(socket, data);
    });

    socket.on("message",async (data) => {
      console.log("data received: ", data);
      let obj = JSON.parse(data);
      await this.messageService.createMessage({ ...obj });


      let dataReceiver = await this.messageService.listByUserId(obj.receiver);
      let dataSender = await this.messageService.listByUserId(obj.sender);
      this.connectedClients.forEach((e) => {
        e.emit(`message/receive`, JSON.stringify({userId: obj.receiver, data: dataReceiver}));
        e.emit(`message/receive`, JSON.stringify({userId: obj.sender, data: dataSender}));
      });
    });

    socket.on("message/get_all/request", async (data) => {
      let userId = data;
      let messages = await this.messageService.listByUserId(userId);
      socket.emit(`message/get_all/response`, JSON.stringify(messages));
    });
  }

  // Add more methods for handling events, messages, etc.
  handleCreateOrderSuccess(socket: Socket, data: string): void {
    this.connectedClients.forEach((e) => {
      e.emit("driver/create_order_success", data)
    });
  }

  handleReceivedOrderSuccess(socket: Socket, data: string): void {
    let objData = JSON.parse(data || "{}");
    this.connectedClients.forEach((e) => {
      e.emit(`user-${objData?.userId}`, data);
    });
  }

  handleDriverReceivedOrderSuccess(socket: Socket, data: string): void {
    let objData = JSON.parse(data || "{}");
    this.connectedClients.forEach((e) => {
      e.emit(`driver-${objData?.userId}`, data);
    });
  }

  
}
