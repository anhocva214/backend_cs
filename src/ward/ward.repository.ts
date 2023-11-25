import { Ward } from './entities/ward.entity';
import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { DataSource, EntityManager, Repository } from "typeorm";
import * as bcrypt from "bcrypt";

@Injectable()
export class WardRepository extends Repository<Ward> {
  constructor(private dataSource: DataSource) {
    super(Ward, dataSource.createEntityManager());
  }
}
