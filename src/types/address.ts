export interface TAddress {
  id: string;
  fullName: string;
  phoneNumber: string;
  emailAddress: string;
  password: string;
  location: any;
  profileImage: any;
  deliveryAddresses: DeliveryAddress[];
}

export interface DeliveryAddress {
  id: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  name: string;
  phoneNumber: string;
  ownerId: string;
  ownerType: string;
  location: Location;
  default: boolean;
}

export interface Location {
  latitude: number;
  longitude: number;
}
