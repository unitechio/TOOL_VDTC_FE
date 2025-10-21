import axios from "axios";
import { urlBase } from "./modules/UrlBase";

export const http = axios.create({
    baseURL: urlBase,
    timeout: 30000,
});
