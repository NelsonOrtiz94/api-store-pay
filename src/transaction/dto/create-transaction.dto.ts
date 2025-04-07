export class CreateTransactionDto {
  fullName: string;
  email: string;
  phone: string;

  address: string;
  city: string;
  postalCode: string;
  country: string;

  productId: number;
}
