import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { OrderRepository } from './order.repository';
import { EntityManager } from 'typeorm';
import { Order } from './entities/order.entity';

@Injectable()
export class OrderService {
  constructor(
    private orderRepository: OrderRepository
  ) {}
  async create(transactionManager: EntityManager, createOrderDto: CreateOrderDto, user) {
    try {
      const order = await this.orderRepository.createOrder(transactionManager, createOrderDto, user)
      if (order) {
        return { 
          statusCode: 200,
          order,
          message: 'Đơn hàng đã tạo thành công. Vui lòng kiểm tra lại trong mục My Order'
        }
      }
    } catch (err) {
    throw new InternalServerErrorException('Lỗi trong quá trình tạo đơn hàng', err.message);
    }
  }

  async trackingOrder(id: number, user){
    try {
      const order = await this.orderRepository.getListOrderTracking(id, user)
    } catch(err) {
      throw new InternalServerErrorException('Error when getting list order tracking')
    }
  }

  async findAll(transactionManager: EntityManager, user) {
    try {
      const order = await this.orderRepository.getOrderList(transactionManager, user)
      order.map(user => { 
        delete user.user?.password;
        return user;
    }) ;
      return {
        status: 200,
        data: { order, total: order.length },
        message: 'Get Order List Successfully'
      };
    } catch (err) {
      throw new InternalServerErrorException('Lỗi trong quá trình lay danh sach đơn hàng', err.message);
    }
    // return `This action returns all order`;
  }

  async findAllSortOrder(transactionManager: EntityManager, user, order){
    try {
      const orderList = await this.orderRepository.getOrderListSortOrder(transactionManager, user, order);
      return {
        status: 200,
        data: {orderList, total: orderList.length},
        message: 'Order List Retrieved Successfully'
      }
    } catch (error) {
      throw new InternalServerErrorException('Order List Cannot Be Retrieved ', error.message);
    }
  }

  async findAllFilter(transactionManager: EntityManager, user, status, weight){
    try {
      let orderList = await this.orderRepository.getOrderList(transactionManager, user);
      // console.log(orderList);
      if (status) {
        // console.log(status);
        orderList = orderList.filter(order => order.status.status === status);
        // console.log(orderList);
      }
      
      if (weight) {
        orderList = orderList.filter(order => order.estWeight == weight);
      }

      return {
        status: 200,
        data: {orderList, total: orderList.length},
        message: 'Order List Retrieved Successfully'
      }
    } catch (error) {
      throw new InternalServerErrorException('Order List Cannot Be Retrieved ', error.message);
    }
  }

  async findOne(id: number, user) {
    try {
      const order = await this.orderRepository.getOrderDetail(id, user);
      order.map(user => { 
        delete user.user?.password;
        return user;
    }) ;
      delete user.password;
      return {
        status: 200,
        data: { order: order, user: user },
        message: 'Get Order List Successfully'
      };
    } catch (err) {
    throw new InternalServerErrorException('Lỗi trong quá trình lay danh sach đơn hàng', err.message);
    }
    // return `This action returns a #${id} order`;
  }

  update(id: number, updateOrderDto: UpdateOrderDto) {
    return `This action updates a #${id} order`;
  }

  remove(id: number) {
    return `This action removes a #${id} order`;
  }

  async updateOrderDetail(transactionManager, id: number, orderDto) {
    try {
      const order = await this.orderRepository.updateOrderDetail(transactionManager, id, orderDto);
      order.map(user => { 
        delete user.user?.password;
        return user;
    }) ;
     
      return {
        status: 200,
        data: { order: order },
        message: 'Update Successfully'
      };
    } catch (err) {
    throw new InternalServerErrorException('Lỗi trong quá trình cap nhat đơn hàng', err.message);
    }
    // return `This action returns a #${id} order`;
  }

  async cancelOrder(transactionManager, id: number){
    try {
      const order = await this.orderRepository.cancelOrder(transactionManager, id);
      // order.map(user => {
      //   delete user.user?.password;
      //   return user;
      // });
    } catch (error) {
      throw new InternalServerErrorException('Error when updated order', error.message);
    }
  }

  async adminFindAll(transactionManager: EntityManager, user) {
    try {
      const order = await this.orderRepository.adminGetOrderList(transactionManager, user)
      order.map(user => { 
        delete user.user?.password;
        return user;
    }) ;
      return {
        status: 200,
        data: { order, total: order.length },
        message: 'Get Order List Successfully'
      };
    } catch (err) {
      throw new InternalServerErrorException('Lỗi trong quá trình lay danh sach đơn hàng', err.message);
    }
    // return `This action returns all order`;
  }

  async adminFindOne(id: number, user) {
    try {
      const order = await this.orderRepository.adminGetOrderDetail(id, user);
      order.map(user => { 
        delete user.user?.password;
        return user;
    }) ;
      delete user.password;
      return {
        status: 200,
        data: { order: order, user: user },
        message: 'Get Order List Successfully'
      };
    } catch (err) {
    throw new InternalServerErrorException('Lỗi trong quá trình lay danh sach đơn hàng', err.message);
    }
    // return `This action returns a #${id} order`;
  }

}
