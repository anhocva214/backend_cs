import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";

@Entity("public.wards")
export class Ward {
    @PrimaryColumn()
    code: string;

    @Column()
    name: string;

    @Column()
    nameEn: string;

    @Column()
    fullName: string;

    @Column()
    fullNameEn: string;

    @Column()
    codeName: string;

    @Column()
    districtCode: string;

    @Column()
    administrativeUnitId: string
}
