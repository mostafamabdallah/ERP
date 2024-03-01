import axios from "axios";

const BASE_URL = process.env.BASE_URL || "https://taswika-72f10gyk3-mostafas-projects-4ce3ab21.vercel.app";

console.log(BASE_URL);


export const customFetch = axios.create({
  baseURL:BASE_URL+"/api/",
});
