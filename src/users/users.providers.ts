import { DataSource } from "typeorm";
import { Users } from "./entities/user.entity";

export const usersProviders = [
  {
    provide: "USERS_REPOSITORY",
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Users),
    inject: ["DATA_SOURCE"],
  },
];
