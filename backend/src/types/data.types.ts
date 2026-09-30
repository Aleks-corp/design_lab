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
  merchantAccount?: string;
  merchantSignature?: string;
  amount?: string | number;
  currency?: string;
  authCode?: string;
  cardPan?: string;
  reasonCode?: string | number;
  reason?: string;
}
