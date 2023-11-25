import { Module } from "@nestjs/common";
import { UsersService } from "./users.service";
import { JwtModule } from "@nestjs/jwt";
import { UsersController } from "./users.controller";
import { UsersRepository } from "./users.repository";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserResolver } from "./user.resolver";

@Module({
  imports: [
    TypeOrmModule.forFeature([UsersRepository]),
    JwtModule.register({
      secret: `${process.env.JWT_SECRET}`,
      signOptions: {
        expiresIn: "1h",
      },
    }),
  ],
  controllers: [UsersController],
  providers: [UsersService, UsersRepository, UserResolver],
  exports: [UsersService, UsersRepository],
})
export class UsersModule {}
