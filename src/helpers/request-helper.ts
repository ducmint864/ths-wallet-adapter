import { AxiosError, AxiosResponse, AxiosRequestConfig } from "axios";
import { ProtocolResponse, ProtocolError } from "thasa-wallet-interface";
import { getCsrfToken } from "./credential-helper";
import { axiosInstance } from "../common/axios-instance";

enum RequestMethod {
	GET,
	POST,
	PATCH,
	PUT,
	DELETE,
	OPTIONS,
};

/**
 * 
 * @param url 
 * @param data
 * @returns ProtocolResponse if request succeeds
 * @throws ProtocolError if request fails
 */
async function request(
	method: RequestMethod,
	url: string,
	data?: object,
	requestConfig?: AxiosRequestConfig
): Promise<ProtocolResponse> {
	if (!url) {
		throw new ProtocolError("Invalid request URL", 400);
	}

	if (!requestConfig) {
		requestConfig = {};
	} 

	if (!requestConfig.headers) {
		requestConfig.headers = { };
	}

	// Inject X-CSRF-TOKEN
	if (!requestConfig.headers["X-CSRF-TOKEN"]) {
		requestConfig.headers["X-CSRF-TOKEN"] = getCsrfToken() ?? "";
	}

	try {
		let response: AxiosResponse;
		switch (method) {
			case RequestMethod.GET:
				response = await axiosInstance.get(url, requestConfig);
				break;
			case RequestMethod.POST:
				response = await axiosInstance.post(url, data, requestConfig);
				break;
			case RequestMethod.PATCH:
				response = await axiosInstance.patch(url, data, requestConfig);
				break;
			case RequestMethod.PUT:
				response = await axiosInstance.put(url, data, requestConfig);
				break;
			case RequestMethod.DELETE:
				response = await axiosInstance.delete(url, requestConfig);
				break;
			case RequestMethod.OPTIONS:
				response = await axiosInstance.options(url, requestConfig);
				break;
			default:
				throw new ProtocolError(`Unsupported request method: ${method}`, 501);
		}
		return ProtocolResponse.fromAxiosResponse(response);
	} catch (err) {
		if (err instanceof AxiosError) {
			throw ProtocolError.fromAxiosError(err);
		} else {
			throw ProtocolError.fromError(err);
		}
	}
}

export {
	request,
	RequestMethod,
}