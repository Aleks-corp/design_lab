import axios from "axios";
import { setAxiosBaseUrl } from "../helpers/setAxiosBaseUrl";

const host = await setAxiosBaseUrl();

export const instance = axios.create({
  baseURL: host,
});
console.log("instance:", instance);

export const setToken = (token: string) => {
  instance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
};

export const delToken = () => {
  instance.defaults.headers.common["Authorization"] = "";
};
