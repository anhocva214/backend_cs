import { IsNumber, IsString } from "class-validator";

export class CreateOrderDto {
  @IsString()
  pickupLocation: any;

  packageDestinations: Destination[];

  @IsNumber()
  orderType: number;

  @IsNumber()
  estWeight: number;

  dimension: Dimension;
  
  @IsString()
  noteForDriver: string;

  vehicle: any;
}

class Destination {
    @IsString()
    address: string;

    @IsNumber()
    typeAccommodation: number;

    receiver: Receiver;
}

class Receiver {
    @IsString()
    name: string;
    
    @IsString()
    phoneNumber: string;

    @IsString()
    email: string;
}

class Dimension {
    @IsNumber()
    width: number;
    
    @IsNumber()
    length: number;
    
    @IsNumber()
    height: number;
}