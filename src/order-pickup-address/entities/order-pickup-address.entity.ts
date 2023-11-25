import { District } from "src/district/entities/district.entity";
import { Province } from "src/provinces/entities/provinces.entity";
import { Ward } from "src/ward/entities/ward.entity";
import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";

@Entity("csedeli.order_pickup_address")
export class OrderPickupAddress {
    @PrimaryColumn()
    id: number;

    @Column()
    orderId: number;

    @Column()
    addressNumber: string;

    @Column()
    street: string;

    @Column()
    wardId: string;

    @Column()
    districtId: string;

    @Column()
    provinceId: string;

    @OneToOne(() => Ward)
    @JoinColumn({name: 'ward_id', referencedColumnName: 'code'})
    ward: Ward;

    @OneToOne(() => District)
    @JoinColumn({name: 'district_id', referencedColumnName: 'code'})
    district: District;

    @OneToOne(() => Province)
    @JoinColumn({name: 'province_id', referencedColumnName: 'code'})
    province: Province;
}
