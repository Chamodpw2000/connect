// import axios, { InternalAxiosRequestConfig } from "axios";
// import { NextAuthOptions } from "next-auth";

// const createHttpClient = (getAuthOptions: ()=> NextAuthOptions)=>{
//     const axiosInstance = axios.create({
//         baseURL:"api/",
//         withCredentials: false
//     });

//     axiosInstance.interceptors.request.use(async (config: InternalAxiosRequestConfig): Promise<InternalAxiosRequestConfig> => {
        
//         config.headers = config.headers || {};
        
//         return null;
//     })
// }

