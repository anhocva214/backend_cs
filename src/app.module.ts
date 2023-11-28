import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { SnakeNamingStrategy } from "typeorm-naming-strategies";
import { GraphQLModule } from "@nestjs/graphql";
import { ScheduleModule } from "@nestjs/schedule";
import { ApolloDriver, ApolloDriverConfig } from "@nestjs/apollo";
import { TypeOrmModule, TypeOrmModuleOptions } from "@nestjs/typeorm";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { UsersModule } from "./users/users.module";
import { OrderModule } from "./order/order.module";
import { OrderDimensionModule } from "./order-dimension/order-dimension.module";
import { OrderDestinationModule } from "./order-destination/order-destination.module";
import { ReceiverModule } from "./receiver/receiver.module";
import { StatusModule } from "./status/status.module";
import { VehicleModule } from "./vehicle/vehicle.module";
import { VehicleTypeModule } from "./vehicle-type/vehicle-type.module";
import { OrderDriverVehicleModule } from "./order-driver-vehicle/order-driver-vehicle.module";
import { ServiceAdditionModule } from "./service-addition/service-addition.module";
import { SocketModule } from "./socket/socket.module";

import { WardModule } from "./ward/ward.module";
import { DistrictModule } from "./district/district.module";
import { ProvincesModule } from "./provinces/provinces.module";
import { OrderPickupAddressModule } from "./order-pickup-address/order-pickup-address.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `env/${process.env.NODE_ENV || "local"}.env`,
    }),
    ScheduleModule.forRoot(),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],

      useFactory: async (configService: ConfigService) =>
        ({
          type: "postgres",
          synchronize: false,
          host: configService.get<string>("DATABASE_HOST"),
          port: Number(configService.get<string>("DATABASE_PORT")),
          username: configService.get<string>("DATABASE_USER_NAME"),
          password:
            process.env.NODE_ENV == "local"
              ? configService.get<string>("DATABASE_PASSWORD")
              : process.env.DB_PASS,
          database: configService.get<string>("DATABASE_NAME"),
          entities: [__dirname + "/**/*.entity.{js,ts}"],
          namingStrategy: new SnakeNamingStrategy(),
        } as TypeOrmModuleOptions),
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: "mgs-schema.gql",
    }),
    UsersModule,
    OrderModule,
    OrderDimensionModule,
    OrderDestinationModule,
    ReceiverModule,
    StatusModule,
    WardModule,
    DistrictModule,
    ProvincesModule,
    OrderPickupAddressModule,
    VehicleModule,
    VehicleTypeModule,
    OrderDriverVehicleModule,
    ServiceAdditionModule,
    SocketModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
