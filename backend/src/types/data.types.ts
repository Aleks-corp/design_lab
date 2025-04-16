interface PaymentData {
  orderReference: string;
  orderDate: number;
  clientAccountId: string;
  clientEmail: string;
  dateNext: string;
  dateEnd: string;
}

interface ResponseData {
  orderReference: string;
  transactionStatus: string;
  phone: string;
  regularDateEnd: string;
}
