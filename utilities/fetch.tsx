import axios from "axios";

const BASE_URL = process.env.BASE_URL;

export const customFetch = axios.create({
  baseURL: '/api/' ,
});
