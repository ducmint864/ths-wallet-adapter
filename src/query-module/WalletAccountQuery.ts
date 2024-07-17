import { ProtocolError, ProtocolResponse } from "thasa-wallet-interface";
import { requestHelpers } from "../helpers";
import { bech32 } from "bech32";

const RequestMethod = requestHelpers.RequestMethod;

export class WalletAccountQuery {
	private static isValidBech32Address(address: string): boolean {
		const decoded = bech32.decode(address)
		if (!decoded) {
			return false;
		}
		return true;
	}

	public static async getMyWalletInfo(
		includeAddress: boolean = true,
		includeNickname: boolean = true,
		includeCryptoHdPath: boolean = true,
		isMainWallet: boolean = true,
		walletOrder?: number
	): Promise<ProtocolResponse> {
		const url = "/api/query/wallet-account/my-wallet";

		if (!isMainWallet && !walletOrder) {
			isMainWallet = true;
		}

		const requestConfig = {
			params: {
				"includeAddress": includeAddress.toString(),
				"includeNickname": includeNickname.toString(),
				"includeCryptoHdPath": includeCryptoHdPath.toString(),
				"isMainWallet": isMainWallet.toString(),
				"walletOrder": walletOrder?.toString(),
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