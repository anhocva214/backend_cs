import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { DataSource, EntityManager, Repository, getRepository } from "typeorm";
import * as bcrypt from "bcrypt";
import { Order } from "./entities/order.entity";
import { CreateOrderDto } from "./dto/create-order.dto";
import { OrderDestination } from "src/order-destination/entities/order-destination.entity";
import { Receiver } from "src/receiver/entities/receiver.entity";
import { OrderDimension } from "src/order-dimension/entities/order-dimension.entity";
import { JwtService } from "@nestjs/jwt";
import { Status } from "src/status/entities/status.entity";
import { OrderPickupAddress } from "src/order-pickup-address/entities/order-pickup-address.entity";
import { Ward } from "src/ward/entities/ward.entity";
import { WardRepository } from "src/ward/ward.repository";
import { District } from "src/district/entities/district.entity";
import { Province } from "src/provinces/entities/provinces.entity";
import axios from "axios";

@Injectable()
export class OrderRepository extends Repository<Order> {
    constructor(private dataSource: DataSource, 
        private wardRepository: WardRepository
    ) {
        super(Order, dataSource.createEntityManager());
    }

    async getListOrderTracking(id: number, user) {
        console.log(id);
        
        const orderList = await this.dataSource
            .getRepository(Order)
            .createQueryBuilder('order')
            .select('order')
            .where('order.pickupLocation = :id', { id })
            .getOne(); 

        console.log("🚀 ~ file: order.repository.ts:31 ~ OrderRepository ~ getListOrderTracking ~ orderList:", orderList)
    }

    async createOrder(transactionManager: EntityManager, createOrderDto: CreateOrderDto, user) {
        const {
            pickupLocation,
            packageDestinations,
            orderType,
            estWeight,
            dimension,
            vehicle,
            noteForDriver
        } = createOrderDto;
        const { width, length, height } = dimension;
        const order = await transactionManager.create(Order, {
            // pickupLocation,
            createdAt: new Date(),
            updatedAt: new Date(),
            isThirdParty: false,
            noteForDriver,
            typeOrder: orderType,
            estWeight: estWeight,
            userId: user.id,
            vehicleTypeId: vehicle.id,
        })

        const orderCreated = await transactionManager.save(order)

        const districtPickupAddressCode = await this.dataSource.getRepository(District)
            .createQueryBuilder('districtPickup')
            .where('districtPickup.fullName = :district', {
                district: pickupLocation.address_components[2].long_name
            })
            .orWhere('districtPickup.name = :district', {
                district: pickupLocation.address_components[2].long_name
            })
            .getOne()

        const provincePickupAddressCode = await this.dataSource.getRepository(Province)
        .createQueryBuilder('provincePickup')
        .where('provincePickup.fullName = :province', {
            province: pickupLocation.address_components[3].long_name
        })
        .getOne()

        const orderPickupAddressObject = await transactionManager.create(OrderPickupAddress, {
            orderId: orderCreated.id,
            addressNumber: pickupLocation.address_components[0].long_name,
            street: pickupLocation.address_components[1].long_name,
            districtId: districtPickupAddressCode.code,
            provinceId: provincePickupAddressCode.code
        })

        await transactionManager.save(orderPickupAddressObject)

        const dimensionObject = await transactionManager.create(OrderDimension, {
            orderId: orderCreated.id,
            width,
            length,
            height,
        })

        await transactionManager.save(dimensionObject)

        let packageDestinationsObject = []
        for (let item of packageDestinations) {
            const { address, typeAccommodation, receiver } = item;
            const { name, phoneNumber, email } = receiver;
            const receiverObject = transactionManager.create(Receiver, {
                name, phoneNumber, email
            })

            const destinationDecodeResponse = await axios.get('https://maps.googleapis.com/maps/api/geocode/json', {
                params: {
                    address,
                    key: process.env.GOOGLE_API_KEY,
                },
            });

            const districtPickupAddressCode = await this.dataSource.getRepository(District)
                .createQueryBuilder('districtPickup')
                .where('districtPickup.fullName = :district', {
                    district: destinationDecodeResponse.data.results[0].address_components[2].long_name
                })
                .orWhere('districtPickup.name = :district', {
                    district: destinationDecodeResponse.data.results[0].address_components[2].long_name
                })
                .getOne()

            const provincePickupAddressCode = await this.dataSource.getRepository(Province)
                .createQueryBuilder('provincePickup')
                .where('provincePickup.fullName = :province', {
                    province: destinationDecodeResponse.data.results[0].address_components[3].long_name
                })
                .getOne()

            const receiverObjectSaved = await transactionManager.save(receiverObject)
            const packageDestinationsObjectSaved = transactionManager.create(OrderDestination, {
                packageDestination: address,
                driverNote: 'note',
                deliveredAt: null,
                orderId: (orderCreated.id).toString(),
                receiverId: receiverObjectSaved.id.toString(),
                streetNumber: destinationDecodeResponse.data.results[0].address_components[0].long_name,
                streetName: destinationDecodeResponse.data.results[0].address_components[1].long_name,
                districtId: districtPickupAddressCode.code,
                provinceId: provincePickupAddressCode.code
            })
            packageDestinationsObject.push(
                packageDestinationsObjectSaved
            )
        }
        await transactionManager.save(packageDestinationsObject)
        return order;
    }

    async getOrderList(transactionManager: EntityManager, user) {
        const query = await this.createQueryBuilder("order")
            .leftJoin('order.status', 'status')
            .leftJoin('order.orderDestination', 'orderDestination')
            .leftJoin('order.orderDimension', 'orderDimension')
            .leftJoin('order.user', 'user')
            .leftJoin('orderDestination.receiver', 'receiver')
            .select(["order", 'orderDestination', 'orderDimension', 'receiver', 'status', 'user'])
            .where(`order.user_id = '${user.id}'`)
            .orderBy('order.id', 'DESC');
        return await query.getMany();
    }

    async getOrderListSortOrder(transactionManager: EntityManager, user, order: 'ASC' | 'DESC') {
        const query = await this.createQueryBuilder("order")
            .leftJoin('order.status', 'status')
            .leftJoin('order.orderDestination', 'orderDestination')
            .leftJoin('order.orderDimension', 'orderDimension')
            .leftJoin('order.user', 'user')
            .leftJoin('orderDestination.receiver', 'receiver')
            .select(["order", 'orderDestination', 'orderDimension', 'receiver', 'status', 'user'])
            .where(`order.user_id = '${user.id}'`)
            // .orderBy(sort, order)
            .orderBy({'order.createdAt': order});
        return await query.getMany();
    }

    async getOrderDetail(id: number, user) {
        const query = await this.createQueryBuilder("order")
            .leftJoin('order.status', 'status')
            .leftJoin('order.orderDestination', 'orderDestination')
            .leftJoin('order.orderDimension', 'orderDimension')
            .leftJoin('order.user', 'user')
            .leftJoin('orderDestination.receiver', 'receiver')
            .select(["order", 'orderDestination', 'orderDimension', 'receiver', 'status', 'user'])
            .where(`order.id = '${id}'`)
            // .andWhere(`order.user_id = '${user.id}'`)
        return await query.getMany();
    }

    async getOrderDestination(id: number, user) {
        const query = await this.createQueryBuilder("order").select(["order"])
            .leftJoinAndSelect(qb => qb
                .select()
                .from(OrderDestination, 'p'), 'order_destination', 'order.id = order_destination.order_id')
            .leftJoinAndSelect(qb => qb
                .select()
                .from(Receiver, 'm'), 'receiver', 'receiver.id = order_destination.receiver_id')
            .where(`order.id = '${id}'`);
        return await query.getRawMany();
    }

    async updateOrderDetail(transactionManager: EntityManager, id , orderDto) {
        const number = orderDto.typeOrder;
        const orderStatus =  orderDto.status
        let orderUpdate = {
            statusId:  orderStatus,
            updatedAt: new Date(),
            estWeight : orderDto.estWeight,
            noteForDriver : orderDto.noteForDriver,
            typeOrder : number,
        }
        await transactionManager.update(Order, id, orderUpdate)
        let orderDimension = {
            width: orderDto.orderDimensionWidth,
            length: orderDto.orderDimensionLength,
            height: orderDto.orderDimensionHeight,
        }
        await transactionManager.update(OrderDimension, {orderId : id}, orderDimension)
        const query = await this.createQueryBuilder("order")
            .leftJoin('order.status', 'status')
            .leftJoin('order.orderDestination', 'orderDestination')
            .leftJoin('order.orderDimension', 'orderDimension')
            .leftJoin('order.user', 'user')
            .leftJoin('orderDestination.receiver', 'receiver')
            .select(["order", 'orderDestination', 'orderDimension', 'receiver', 'status', 'user'])
            .where(`order.id = '${id}'`)
    
        return await query.getMany();
    }

    async cancelOrder(transactionManager: EntityManager, id){
        let orderUpdate = {
            statusId:  3,
            updatedAt: new Date()
        }

        await transactionManager.update(Order, id, orderUpdate);

        let order = await this.createQueryBuilder("order")
                    .leftJoin('order.status', 'status')
                    .leftJoin('order.orderDestination', 'orderDestination')
                    .leftJoin('order.orderDimension', 'orderDimension')
                    .leftJoin('order.user', 'user')
                    .leftJoin('orderDestination.receiver', 'receiver')
                    .select(["order", 'orderDestination', 'orderDimension', 'receiver', 'status', 'user'])
                    .where(`order.id = '${id}'`)

        return await order.getMany();
    }

    async adminGetOrderList(transactionManager: EntityManager, user) {
        const query = await this.createQueryBuilder("order")
            .leftJoin('order.status', 'status')
            .leftJoin('order.orderDestination', 'orderDestination')
            .leftJoin('order.orderDimension', 'orderDimension')
            .leftJoin('order.user', 'user')
            .leftJoin('orderDestination.receiver', 'receiver')
            .select(["order", 'orderDestination', 'orderDimension', 'receiver', 'status', 'user'])
            .orderBy('order.id', 'DESC');
        return await query.getMany();
    }

    async adminGetOrderDetail(id: number, user) {
        const query = await this.createQueryBuilder("order")
            .leftJoin('order.status', 'status')
            .leftJoin('order.orderDestination', 'orderDestination')
            .leftJoin('order.orderDimension', 'orderDimension')
            .leftJoin('order.user', 'user')
            .leftJoin('orderDestination.receiver', 'receiver')
            .select(["order", 'orderDestination', 'orderDimension', 'receiver', 'status', 'user'])
            .where(`order.id = '${id}'`);
        return await query.getMany();
    }
}
