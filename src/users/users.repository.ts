import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { DataSource, EntityManager, Repository } from "typeorm";
import { RegisterDto } from "./dto/register.dto";
import { Users } from "./entities/user.entity";
import * as bcrypt from "bcrypt";
import { OrderDriverVehicle } from "src/order-driver-vehicle/entities/order-driver-vehicle.entity";
import { Vehicle } from "src/vehicle/entities/vehicle.entity";
import { Order } from "src/order/entities/order.entity";

@Injectable()
export class UsersRepository extends Repository<Users> {
  constructor(private dataSource: DataSource) {
    super(Users, dataSource.createEntityManager());
  }

  async getAllCategory() {
    const query = await this.createQueryBuilder("users").select(["users"]);
    return await query.getMany();
  }

  async checkExist(registerDto: RegisterDto) {
    const { email, phoneNumber } = registerDto;
    const query = await this.createQueryBuilder("users")
      .select(["users"])
      .where(`users.email = '${email}'`)
      .orWhere(`users.phoneNumber = '${phoneNumber}'`)
      .getOne()
    
    return query;
  }

  async register(transactionManager: EntityManager, registerDto: RegisterDto) {
    try {
      const {
        fullName,
        email,
        password,
        phoneNumber,
      } = registerDto;

      // hash password
      const saltRounds = 10;
      const salt = bcrypt.genSaltSync(saltRounds);
      const hashedPassword = bcrypt.hashSync(password, salt);

      const user = await transactionManager.create(Users, {
        fullName,
        email,
        password: hashedPassword,
        phoneNumber,
        createdAt: new Date(),
        updatedAt: new Date,
        isActive: true,
      });

      await transactionManager.save(user);
      return user;
    } catch (error) {
      throw new InternalServerErrorException(
        "Lỗi trong quá trình tạo tài khoản"
      );
    }
  }

  async checkPhoneNumberExist(phone) {
    const query = await this.createQueryBuilder("users")
      .select(["users"])
      .where(`users.phoneNumber = '${phone}'`)
      .getCount();
    return query;
  }

  async updateInfoUser(data) {
    const query = await this.createQueryBuilder("users")
      .update(Users)
      .set({ phoneNumber: data.phone, fullName: data.name })
      .where(`users.id = '${data.id}'`)
      .execute();
    return query;
  }

  async getUserDetail(id: number, user) {
    const query = await this.createQueryBuilder("users")
      .where(`users.id = '${id}'`)
    return await query.getMany();
  }

  async updateUserDetail(transactionManager: EntityManager, id, userDto) {
    let userUpdate = {
      isActive: userDto.isActive,
      fullName: userDto.fullName,
      email: userDto.email,
      phoneNumber: userDto.phoneNumber,
      roleId: userDto.roleId
    }

    await transactionManager.update(Users, id, userUpdate)

    const query = await this.createQueryBuilder("users")
      .where(`users.id = '${id}'`)

    return await query.getMany();
  }

  async getAdminDriverList(orderId) {
    const order = orderId ? orderId : 0;
    const query = await this.createQueryBuilder("users")
      .where(`users.roleId = '1'`)
      .andWhere(`users.id not in `
        + this.createQueryBuilder("users").subQuery().select('s.driver').from(OrderDriverVehicle, 's').getQuery())
      .andWhere(`users.id in `
        + this.createQueryBuilder("users").subQuery().select('v.user').from(Vehicle, 'v').where('v.weight >='
          + this.createQueryBuilder("users").subQuery().select('o.estWeight').from(Order, 'o').where('o.id =' + orderId).getQuery()
        ).getQuery());
    return await query.getMany();
  }

  async adminAddUser(transactionManager: EntityManager, userDto) {
    const saltRounds = 10;
    const salt = bcrypt.genSaltSync(saltRounds);
    const hashedPassword = bcrypt.hashSync(userDto.password, salt);
    let userUpdate = {
      isActive: userDto.isActive,
      fullName: userDto.fullName,
      email: userDto.email,
      phoneNumber: userDto.phoneNumber,
      roleId: userDto.roleId,
      createdAt: new Date(),
      updatedAt: new Date,
      password: hashedPassword
    }

    const user = await transactionManager.create(Users, userUpdate);

    await transactionManager.save(user);
    return user;
  }
}
