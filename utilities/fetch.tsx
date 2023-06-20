import axios from "axios";

export const customFetch = axios.create({
  baseURL: "http://192.168.1.19:3000/api/",
});
