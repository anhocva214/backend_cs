import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";

@Entity("public.provinces")
export class Province {
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
    administrativeUnitId: string;

    @Column()
    administrativeRegionId: string;
}
