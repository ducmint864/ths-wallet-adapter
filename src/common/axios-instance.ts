import axios, { AxiosInstance } from "axios";
import https from "https";

const baseUrl: string = process.env.WEB_SERVER_URL || "https://localhost:3000";
const axiosInstance: AxiosInstance = axios.create({
	baseURL: baseUrl,
	withCredentials: true,
	httpsAgent: new https.Agent({
		rejectUnauthorized: false, // Development only (Change this in production)
	}),
});

export { axiosInstance }