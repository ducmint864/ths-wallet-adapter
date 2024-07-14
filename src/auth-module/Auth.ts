import axios, { AxiosError, AxiosInstance, AxiosResponse } from "axios";
import createHttpError from "http-errors";
import { ProtocolError } from "thasa-wallet-interface";
import { ProtocolResponse } from "thasa-wallet-interface";
import https from "https";
import { requestHelpers } from "../helpers";

const RequestMethod = requestHelpers.RequestMethod;

export class Auth {
	/**
	 * 
	 * @param email 
	 * @param username 
	 * @param password 
	 * @returns ProtocolResponse
	 * @throws ProtocolError
	 */
	public static async register(email: string, username: string, password: string): Promise<ProtocolResponse> {
		if (!email || !username || !password) {
			throw new ProtocolError("Missing email or username or password", 400);
		}

		const url = "/api/auth/register";

		const data = {
			"email": email,
			"username": username,
			"password": password
		};

		try {
			const protoResponse: ProtocolResponse = await requestHelpers.request(RequestMethod.POST, url, data);
			return protoResponse;
		} catch (protoErr) {
			throw protoErr;
		}
	}

	/**
	 * 
	 * @param password 
	 * @param email 
	 * @param username 
	 * @returns ProtocolResponse
	 * @throws ProtocolError
	 */
	public static async login(password: string, email?: string, username?: string): Promise<ProtocolResponse> {
		let hasEmail: boolean, hasUsername: boolean;
		if (email) {
			hasEmail = true;
		} else if (username) {
			hasUsername = true;
		}

		if (!hasEmail && !hasUsername) {
			throw new ProtocolError("Missing email or username", 400);
		}

		const url = ("/api/auth/login");

		const data = hasEmail ? {
			"email": email,
			"password": password
		} : {
			"username": username,
			"password": password
		};

		try {
			const protoResponse: ProtocolResponse = await requestHelpers.request(RequestMethod.POST, url, data);
			return protoResponse;
		} catch (protoErr) {
			throw protoErr;
		}
	}


	public static async logout(): Promise<ProtocolResponse> {
		const url = ("/api/auth/logout");
		try {
			const protoResponse: ProtocolResponse = await requestHelpers.request(RequestMethod.POST, url);
			return protoResponse;
		} catch (protoErr) {
			throw protoErr;
		}
	}

	public static async getAccessToken(): Promise<ProtocolResponse> {
		const url = "/api/auth/get-access-token";
		try {
			const protoResponse: ProtocolResponse = await requestHelpers.request(RequestMethod.GET, url);
			return protoResponse;
		} catch (protoErr) {
			throw protoErr;
		}
	}
}
