import { ProtocolError, ProtocolResponse } from "thasa-wallet-interface";
import { requestHelpers } from "../helpers";
import { join } from "path";
import { walletServerUrl } from "../config";

const RequestMethod = requestHelpers.RequestMethod;

/**
 * Class for querying user account information
 */
export class UserAccountQuery {
	/**
	 * Base URL for user account queries.
	 */
	public static readonly baseUrl: string = join(walletServerUrl.modules.query.moduleUrl, "/user-account");

	/**
   	 * Retrieves the current user's account information.
   	 *
   	 * @param {boolean} Whether to include the user's email in the response. Defaults to `true`.
   	 * @param {boolean} Whether to include the user's username in the response. Defaults to `true`.
	 * @param {boolean} Whether to include the user's main wallet information in the response. Defaults to `true`.
   	 * @returns A `ProtocolResponse` object indicating the query result.
	 * @throws `ProtocolError` object if the query fails.
	 * 
   	 * Example:
	 * ```
   	 * const response = await UserAccountQuery.getMyAccountInfo();
   	 * console.log(response.data); // { email: "user@example.com", username: "username", mainWallet: { ... } }
	 * 
	 * // Retrieve account info without email and username, only main wllet info
	 * const response = await UserAccountQuery.getMyAccountInfo(false, false, true);
  	 * console.log(response.data); // { mainWallet: { ... } }
	 * ```
	 * 
	 * More detailed examples at {@link https://github.com/ducmint864/ths-wallet-adapter}
   	 */
	public static async getMyAccountInfo(
		includeEmail: boolean = true,
		includeUsername: boolean = true,
		includeMainWallet: boolean = true
	): Promise<ProtocolResponse> {
		const url = join(this.baseUrl, "/my-account");

		// Attach query-params to request
		const requestConfig = {
			params: {
				"includeEmail": includeEmail?.toString(),
				"includeUsername": includeUsername?.toString(),
				"includeMainWallet": includeMainWallet?.toString(),
			}
		}

		try {
			const protoResponse: ProtocolResponse = await requestHelpers.request(RequestMethod.GET, url, undefined, requestConfig);
			return protoResponse;
		} catch (protoErr: ProtocolError | unknown) {
			throw protoErr;
		}
	}
}
