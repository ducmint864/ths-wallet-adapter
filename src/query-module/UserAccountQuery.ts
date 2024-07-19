import { ProtocolError, ProtocolResponse } from "thasa-wallet-interface";
import { requestHelpers } from "../helpers";
import { join } from "path";
import { walletServerUrl } from "../config";

const RequestMethod = requestHelpers.RequestMethod;

export class UserAccountQuery {
	constructor() {
	}

	public static readonly baseUrl: string = join(walletServerUrl.modules.query.moduleUrl, "/user-account");

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
