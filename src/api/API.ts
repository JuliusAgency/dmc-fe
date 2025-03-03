import axios, { AxiosRequestConfig } from "axios";
import {CONFIG} from "../consts/config.ts";

const apiConfig = {
  BASE_URL: CONFIG.BASE_URL,
  TIMEOUT: 25000,
};

const axiosConfig: AxiosRequestConfig = {
  baseURL: apiConfig.BASE_URL,
  timeout: apiConfig.TIMEOUT,
  headers: {
    Accept: "application/json",
  },
};

// axios.defaults.withCredentials = true;
export const API = axios.create(axiosConfig);
