import axios from "axios";

export const customFetch = axios.create({
  baseURL: process.env.BASE_URL+"/api/",
});
