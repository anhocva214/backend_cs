import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  HttpException,
  HttpStatus,
  Inject,
  InternalServerErrorException,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import * as jwt from "jsonwebtoken";
import { UsersService } from "src/users/users.service";
import { UsersRepository } from "src/users/users.repository";
import { DataSource } from "typeorm";
import { Users } from "src/users/entities/user.entity";

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    // private reflector: Reflector,
    @Inject(UsersService)
    private usersRepository: UsersRepository,
    private datasource: DataSource
  ) { }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    if (!request.headers.authorization) {
      throw new UnauthorizedException(
        "Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại!"
      );
    }

    request.token = await this.validateToken(request.headers.authorization);
    let active = false;
    const users = await this.datasource
      .getRepository(Users)
      .createQueryBuilder("user")
      .andWhere("user.phoneNumber = :phone", {
        phone: request.token["phoneNumber"],
      }).getOne();
    // const users = await this.usersRepository.findOne({
    //   where: {
    //     phoneNumber: request.token["phoneNumber"],
    //   },
    // });
    if (users) {
      request.users = users;
      active = true;
    }
    return active;
  }

  async validateToken(auth: string) {
    if (auth.split(" ")[0] !== "Bearer") {
      throw new HttpException("Invalid token", HttpStatus.FORBIDDEN);
    }
    const token = auth.split(" ")[1];
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      return decoded;
    } catch (error) {
      throw new UnauthorizedException(
        "Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại!"
      );
    }
  }
}
