import { instance } from "../api/axios";
import { UserProfile } from "../types/auth.types";
import { nextDate } from "./setDate";

interface FormData {
  orderReference: string;
  orderDate: number;
  amount: string;
  currency: string;
  productName: string[];
  productCount: number[];
  productPrice: string[];
  clientAccountId: string;
  clientEmail: string;
  merchantAuthType: string;
  merchantTransactionSecureType: string;
  recurringToken: string;
  regularMode: string;
  regularAmount: string;
  regularBehavior?: string;
  regularOn: number;
  dateNext: string;
  dateEnd: string;
}

interface PaymemtData {
  orderReference: string;
  orderDate: number;
  clientAccountId: string;
  clientEmail: string;
  dateNext: string;
  dateEnd: string;
}

const generatePaymentData = async (data: PaymemtData) => {
  const response = await instance.post("/users/create-payment", { data });
  return response.data;
};

export const handleWayForPay = async (user: UserProfile) => {
  const form = document.createElement("form");
  form.action = "https://secure.wayforpay.com/pay";
  form.method = "POST";
  form.style.display = "none";

  const currentDate = new Date();

  const data = {
    orderReference: `ORDER-${currentDate.getTime()}`,
    orderDate: currentDate.getTime(),
    clientAccountId: `${user.email}`,
    clientEmail: `${user.email}`,
    dateNext: nextDate(currentDate).nextDate,
    dateEnd: nextDate(currentDate).dateEnd,
  };
  const paymentData = await generatePaymentData(data);

  const wayForPayData: FormData = {
    ...paymentData,
  };

  for (const key in wayForPayData) {
    const typedKey = key as keyof FormData;
    if (Array.isArray(wayForPayData[typedKey])) {
      wayForPayData[typedKey].forEach((value) => {
        const input = document.createElement("input");
        input.type = "hidden";
        input.name = `${key}[]`;
        input.value = value;
        form.appendChild(input);
      });
    } else {
      const input = document.createElement("input");
      input.type = "hidden";
      input.name = key;
      input.value = wayForPayData[typedKey] as string;
      form.appendChild(input);
    }
  }

  document.body.appendChild(form);

  form.submit();
};
