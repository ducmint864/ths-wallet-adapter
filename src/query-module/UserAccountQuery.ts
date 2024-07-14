import { ProtocolResponse, UserAccountInfo } from "thasa-wallet-interface";
import { requestHelpers } from "../helpers";

const RequestMethod = requestHelpers.RequestMethod;

export class UserAccountQuery {
	constructor() {
	}

	public static async getAccountInfo(includeEmail?: boolean, includeUsername?: boolean, includeMainWallet?: boolean): Promise<ProtocolResponse> {
		const url = "/api/query/user-account/info"
		const data = {
			"includeEmail": includeEmail ?? true,
			"includeUsername": includeUsername ?? true,
			"includeMainWallet": includeMainWallet ?? true,
		};

		try {
			const protoResponse: ProtocolResponse = await requestHelpers.request(RequestMethod.GET, url, data);
			return protoResponse
		} catch (protoErr) {
			throw protoErr;
		}
	}
}
