import { ProtocolError } from "thasa-wallet-interface";
import { ProtocolResponse } from "thasa-wallet-interface";
import { requestHelpers } from "../helpers";
import { walletServerUrl } from "../config";
import { join } from "path";


const RequestMethod = requestHelpers.RequestMethod;

/**
 * Authentication class providing methods for registering, logging in, logging out, and getting access tokens.
 */
export class Auth {
	public static baseUrl: string = walletServerUrl.modules.auth.moduleUrl;

	/**
	 * Registers a new user with the provided email, username, and password.
	 *
	 * @param email - The user's email address.
	 * @param username - The user's chosen username.
	 * @param password - The user's chosen password.
	 * @returns A ProtocolResponse object indicating the registration result.
	 * @throws ProtocolError if the registration fails.
	 *
	 * Example:
	 * ```
	 * const response = await Auth.register("user@example.com", "username", "password");
	 * console.log(response); // { success: true, message: "User registered successfully" }
	 * ```
	 */

	public static async register(email: string, username: string, password: string): Promise<ProtocolResponse> {
		if (!email || !username || !password) {
			throw new ProtocolError("Missing email or username or password", 400);
		}

		const url: string = join(this.baseUrl, "/register");

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

		const url: string = join(this.baseUrl, "/login");

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
		const url: string = join(this.baseUrl, "/logout");
		try {
			const protoResponse: ProtocolResponse = await requestHelpers.request(RequestMethod.POST, url);
			return protoResponse;
		} catch (protoErr) {
			throw protoErr;
		}
	}

	public static async getAccessToken(): Promise<ProtocolResponse> {
		const url = "/api/auth/get-access-token";
		const url: string = "/api/auth/get-access-token";
		try {
			const protoResponse: ProtocolResponse = await requestHelpers.request(RequestMethod.GET, url);
			return protoResponse;
		} catch (protoErr) {
			throw protoErr;
		}
	}
}
