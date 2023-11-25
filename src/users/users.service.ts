import {
  Inject,
  Injectable,
  InternalServerErrorException,
} from "@nestjs/common";
import { RegisterDto } from "./dto/register.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { Users } from "./entities/user.entity";
import { EntityManager, Repository } from "typeorm";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcrypt";
import { UsersRepository } from "./users.repository";
import { SignInDto } from "./dto/signin.dto";
import { isNullOrUndefined } from "src/common/func/utils";
import { JwtPayload } from "./interfaces/jwt-payload-interface";


@Injectable()
export class UsersService {
  constructor(
    // @Inject("USERS_REPOSITORY")
    private usersRepository: UsersRepository,
    private jwtService: JwtService
  ) { }

  async signin(transactionManager: EntityManager, signInDto: SignInDto) {
    const { phoneNumber, password } = signInDto;
    const user = await transactionManager.getRepository(Users).findOne({
      where: {
        phoneNumber,
        isActive: true,
      },
    });
    if (isNullOrUndefined(user)) {
      throw new InternalServerErrorException(
        "Tài khoản chưa được tạo hoặc chưa được kích hoạt."
      );
    }
    if (!(await bcrypt.compare(password, user.password))) {
      throw new InternalServerErrorException(
        "Tài khoản hoặc mật khẩu không đúng, vui lòng thử lại"
      );
    }
    const payload: JwtPayload = {
      phoneNumber: user.phoneNumber,
    };
    const accessToken = await this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET,
      expiresIn: "1d",
    });
    const refreshToken = await this.jwtService.sign(payload, {
      secret: process.env.REFRESH_TOKEN_SECRET,
      expiresIn: "30d",
    });
    return {
      statusCode: 200,
      message: "Đăng nhập thành công",
      data: { accessToken, refreshToken, user },
    };
  }

  async register(transactionManager: EntityManager, registerDto: RegisterDto) {
    const exist = await this.usersRepository.checkExist(registerDto);
    // if (exist > 0) {
    //   throw new InternalServerErrorException(
    //     "Email hoặc số điện thoại đã được đăng ký trước đó"
    //   );
    // }
    try {
      // Create Users
      const user = await this.usersRepository.register(
        transactionManager,
        registerDto
      );
      return {
        status: 200,
        data: { user },
        message: 'Sign Up Sucessfully 😍'
      };
    } catch (error) {
      throw new InternalServerErrorException("Tạo tài khoản thất bại");
    }
  }

  async findAll(user) {
    try {
      const userList = await this.usersRepository.getAllCategory();
      userList.map(user => {
        delete user.password;
        return user;
      });
      return {
        status: 200,
        message: "Lay danh sach tài khoản thành công",
        data: { userList: userList },
      };
    } catch (err) {
      throw new InternalServerErrorException("Lay danh sach tài khoản thất bại");
    }
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} Users`;
  }

  remove(id: number) {
    return `This action removes a #${id} Users`;
  }

  async getAuth(user) {
    try {
      let userInfo = user;
      userInfo.password = null;
      return {
        status: 200,
        data: { user: userInfo },
        message: 'Get User Info Successfully!'
      };
    } catch (err) {
      throw new InternalServerErrorException('Lỗi trong quá trình lay thong tin user', err.message);
    }
    // return `This action returns a #${id} Users`;
  }

  async edit(transactionManager, data, user) {
    const exist = await this.usersRepository.checkPhoneNumberExist(data.phone);
    if (exist > 0 && data.phone != user.phoneNumber) {
      console.log("Số điện thoại đã được đăng ký trước đó");
      throw new InternalServerErrorException(
        "Số điện thoại đã được đăng ký trước đó"
      );
    }
    try {
      const result = await this.usersRepository.updateInfoUser(data);
      const user = await transactionManager.getRepository(Users).findOne({
        where: {
          phoneNumber: data.phone,
          isActive: true,
        },
      });

      const payload: JwtPayload = {
        phoneNumber: user.phoneNumber,
      };
      const accessToken = await this.jwtService.sign(payload, {
        secret: process.env.JWT_SECRET,
        expiresIn: "1d",
      });
      const refreshToken = await this.jwtService.sign(payload, {
        secret: process.env.REFRESH_TOKEN_SECRET,
        expiresIn: "30d",
      });
      return {
        status: 200,
        message: "Cập nhật tài khoản thành công",
        data: { accessToken, refreshToken, user: user },
      };
    } catch (error) {
      throw new InternalServerErrorException("Cập nhật tài khoản thất bại");
    }
  }

  async findOne(id: number, user) {
    try {
      const userResult = await this.usersRepository.getUserDetail(id, user);
      userResult.map(user => {
        delete user.password;
        return user;
      });
      delete user.password;
      return {
        status: 200,
        data: { userResult: userResult, user: user },
        message: 'Get User Detail Successfully'
      };
    } catch (err) {
      throw new InternalServerErrorException('Lỗi trong quá trình lay thong tin user', err.message);
    }
  }

  async updateUserDetail(transactionManager, id: number, userDto) {
    try {
      const exist = await this.usersRepository.checkPhoneNumberExist(userDto.phoneNumber);
      if (exist > 0 && userDto.oldPhoneNumber != userDto.phoneNumber) {
        console.log("Số điện thoại đã được đăng ký trước đó");
        throw new InternalServerErrorException(
          "Số điện thoại đã được đăng ký trước đó"
        );
      }
      const userResult = await this.usersRepository.updateUserDetail(transactionManager, id, userDto);
      userResult.map(user => {
        delete user.password;
        return user;
      });

      return {
        status: 200,
        data: { userResult: userResult },
        message: 'Update Successfully'
      };
    } catch (err) {
      throw new InternalServerErrorException('Lỗi trong quá trình cap nhat thong tin user', err.message);
    }
    // return `This action returns a #${id} order`;
  }

  async getAdminDriverList(query, user) {
    try {
      const driver = await this.usersRepository.getAdminDriverList(query?.orderId);
      return {
        status: 200,
        data: { driver: driver },
        message: 'Get Driver List Successfully'
      };
    } catch (err) {
      throw new InternalServerErrorException('Lỗi trong quá trình lay danh sach driver', err.message);
    }
    // return `This action returns a #${id} order`;
  }

  async adminAddUser(transactionManager, userDto) {
    try {
      const exist = await this.usersRepository.checkPhoneNumberExist(userDto.phoneNumber);
      if (exist > 0 && userDto.oldPhoneNumber != userDto.phoneNumber) {
        console.log("Số điện thoại đã được đăng ký trước đó");
        throw new InternalServerErrorException(
          "Số điện thoại đã được đăng ký trước đó"
        );
      }
      const userResult = await this.usersRepository.adminAddUser(transactionManager, userDto);

      return {
        status: 200,
        data: { userResult: userResult },
        message: 'Update Successfully'
      };
    } catch (err) {
      throw new InternalServerErrorException('Lỗi trong quá trình them user', err.message);
    }
    // return `This action returns a #${id} order`;
  }
}
