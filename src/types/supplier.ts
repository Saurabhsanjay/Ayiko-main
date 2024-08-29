export interface Supplier {
  id: string;
  companyName: string;
  ownerName: string;
  phoneNumber: string;
  mobileMoneyNumber: string;
  bankAccountNumber: string;
  city: string;
  emailAddress: string;
  password: string;
  profileImageUrl: any;
  businessImages: any[];
  images: any[];
  businessName: any;
  businessDescription: any;
  rating: any;
  location: any;
}

export interface Products {
  id: string;
  name: string;
  description: string;
  category: string;
  supplierId: string;
  unitPrice: string;
  quantity: string;
  imageUrlList: string[];
  imageUrl: any[];
  createdAt: any;
  updatedAt: any;
  productCategory: any;
  available: boolean;
}

export interface Drivers {
  id: string;
  name: string;
  email: string;
  phone: string;
  vehicleNumber: string;
  password: string;
  supplierId: string;
  status: string;
  location: any;
  updatedAt: any;
  lastLoginAt: any;
  profileImage: any;
  active: boolean;
}

export interface SupplierDetails {
  id: string;
  companyName: string;
  ownerName: string;
  phoneNumber: string;
  mobileMoneyNumber: string;
  bankAccountNumber: string;
  city: string;
  emailAddress: string;
  password: string;
  profileImageUrl?: any;
  businessImages: string[];
  images: Image[];
  businessName: string;
  businessDescription: string;
  rating?: any;
  location?: any;
  productCount: number;
}
interface Image {
  id?: any;
  imageUrl: string;
  imageType?: any;
  imageTitle: string;
  imageDescription: string;
  profilePicture: boolean;
}
