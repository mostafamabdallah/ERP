import axios from "axios";

export const customFetch = axios.create({
  baseURL: 'https://taswika.vercel.app/api/' ,
});
