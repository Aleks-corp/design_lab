import { instance } from "../api/axios";
import { UserProfile } from "../types/auth.types";

interface FormData {
  merchantAccount: string;
  merchantDomainName: string;
  orderReference: string;
  orderDate: number;
  amount: string;
  currency: string;
  productName: string[];
  productCount: number[];
  productPrice: string[];
}
interface WayForPayFormData extends FormData {
  clientAccountId: string;
  clientEmail: string;
  merchantSignature: string;
  merchantAuthType: string;
  merchantTransactionSecureType: string;
  recurringToken: string;
  returnUrl: string;
  serviceUrl: string;
  regularMode: string;
  regularAmount: string;
  regularBehavior?: string;
  regularOn: number;
  dateNext: string;
}

const generateSignature = async (data: FormData) => {
  const response = await instance.post("/users/getsignature", { data });
  return response.data.merchantSignature;
};

export const handleWayForPay = async (user: UserProfile) => {
  const form = document.createElement("form");
  form.action = "https://secure.wayforpay.com/pay";
  form.method = "POST";
  form.style.display = "none";

  const currentDate = new Date().getTime();
  const nextDate = () => {
    const nextDay =
      new Date(currentDate).getDate() > 28
        ? 28
        : new Date(currentDate).getDate();
    const nextMonth =
      new Date(currentDate).getMonth() === 11
        ? 1
        : new Date(currentDate).getMonth() + 2;
    const nextYear =
      new Date(currentDate).getMonth() === 11
        ? new Date(currentDate).getFullYear() + 1
        : new Date(currentDate).getFullYear();
    const nextDate = `${nextDay < 10 ? `0` + nextDay : nextDay}.${
      nextMonth < 10 ? `0` + nextMonth : nextMonth
    }.${nextYear}`;
    return nextDate;
  };

  const data = {
    merchantAccount: "test_merch_n1",
    merchantDomainName: "www.market.ua",
    orderReference: `ORDER-${currentDate}`,
    orderDate: Math.floor(currentDate / 1000),
    amount: "5.00",
    currency: "USD",
    productName: ["All-Access-Pass"],
    productCount: [1],
    productPrice: ["5.00"],
  };

  const wayForPayData: WayForPayFormData = {
    ...data,
    clientAccountId: `${user.email}`,
    clientEmail: `${user.email}`,
    merchantSignature: await generateSignature(data),
    merchantAuthType: "SimpleSignature",
    merchantTransactionSecureType: "AUTO",
    recurringToken: "auto",
    returnUrl: "",
    serviceUrl: "",
    regularMode: "monthly",
    regularAmount: "5.00",
    regularBehavior: "preset",
    regularOn: 1,
    dateNext: nextDate(),
  };

  for (const key in wayForPayData) {
    const typedKey = key as keyof WayForPayFormData; // Явно задаємо тип ключа
    if (Array.isArray(wayForPayData[typedKey])) {
      // Якщо значення є масивом, додаємо окремі поля для кожного елемента
      wayForPayData[typedKey].forEach((value) => {
        const input = document.createElement("input");
        input.type = "hidden";
        input.name = `${key}[]`; // Масив має використовувати `[]`
        input.value = value;
        form.appendChild(input);
      });
    } else {
      // Якщо значення не є масивом, додаємо як одне поле
      const input = document.createElement("input");
      input.type = "hidden";
      input.name = key;
      input.value = wayForPayData[typedKey] as string;
      form.appendChild(input);
    }
  }

  // Додаємо форму до DOM
  document.body.appendChild(form);

  console.log("Submitting form with data:", wayForPayData);

  // Відправка форми
  form.submit();
};
