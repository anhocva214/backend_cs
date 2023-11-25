import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ValidationPipe,
  Req
} from "@nestjs/common";
import { UsersService } from "./users.service";
import { SignInDto } from "./dto/signin.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { RolesGuard } from "src/guards/roles.guard";
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";
import { InjectDataSource } from "@nestjs/typeorm";
import { DataSource } from "typeorm";
import { RegisterDto } from "./dto/register.dto";
import { GetUser } from 'src/users/users.decorator'


@Controller("users")
@ApiTags("Users")
export class UsersController {
  constructor(
    @InjectDataSource("default") private dataSource: DataSource,
    private readonly usersService: UsersService
  ) {}

  @Post("login")
  @ApiResponse({
    status: 500,
    description: "Đăng nhập không thành công.",
    type: null,
  })
  @ApiResponse({
    status: 200,
    description: "Đăng nhập thành công.",
  })
  @ApiOperation({ summary: "Đăng nhập" })
  async signIn(@Body(ValidationPipe) signInDto: SignInDto) {
    return await this.dataSource.transaction((transactionManager) => {
      return this.usersService.signin(transactionManager, signInDto);
    });
  }

  @Post("register")
  @ApiResponse({
    status: 500,
    description: "Tạo tài khoản không thành công.",
    type: null,
  })
  @ApiResponse({
    status: 200,
    description: "Tạo tài khoản thành công.",
  })
  @ApiOperation({ summary: "Tại tài khoản người dùng" })
  async register(@Body(ValidationPipe) registerDto: RegisterDto) {
    return await this.dataSource.transaction((transactionManager) => {
      return this.usersService.register(transactionManager, registerDto);
    });
  }

  @Get()
  @UseGuards(RolesGuard)
  @ApiBearerAuth()
  @ApiResponse({
    status: 500,
    description: "Lâý danh sách tài khoản bị lỗi.",
    type: null,
  })
  @ApiResponse({
    status: 200,
    description: "Lấy danh sách tài khoản thành công.",
  })
  @ApiOperation({ summary: "Lấy danh sách tài khoản" })
  async findAll(@GetUser() user) {
    return this.usersService.findAll(user);
  }

  @Get('get-auth')
  @UseGuards(RolesGuard)
  @ApiBearerAuth()
  async getAuth(@GetUser() user) {
    return this.usersService.getAuth(user);
  }

  @Post("edit")
  @UseGuards(RolesGuard)
  @ApiBearerAuth()
  async edit(@Body(ValidationPipe) data,@GetUser() user) {
    return await this.dataSource.transaction((transactionManager) => {
      return this.usersService.edit(transactionManager, data, user);
    });
  }

  @Get(':id')
  @UseGuards(RolesGuard)
  @ApiBearerAuth()
  findOne(@Param('id') id: string, @GetUser() user) {
    return this.usersService.findOne(+id, user);
  }

  @Post('/update/:id')
  @UseGuards(RolesGuard)
  @ApiBearerAuth()
  async updateUserDetail(@Param('id') id: string, @Body() updateUserDto) {
    return await this.dataSource.transaction((transactionManager) => {
      return this.usersService.updateUserDetail(transactionManager, +id, updateUserDto);
    });
  }

  @Get('/admin/driver')
  @UseGuards(RolesGuard)
  @ApiBearerAuth()
  async getAdminDriverList(@Req() req, @GetUser() user) {
    
    return this.usersService.getAdminDriverList(req.query, user);
  }

  @Post('/admin/add')
  @UseGuards(RolesGuard)
  @ApiBearerAuth()
  async adminAddUser(@Param('id') id: string, @Body() updateUserDto) {
    return await this.dataSource.transaction((transactionManager) => {
      return this.usersService.adminAddUser(transactionManager, updateUserDto);
    });
  }
}
