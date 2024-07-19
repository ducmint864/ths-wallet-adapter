import { ProtocolError, ProtocolResponse } from "thasa-wallet-interface";
import { requestHelpers } from "../helpers";
import { bech32 } from "bech32";
import { join } from "path";
import { config } from "../config";

const RequestMethod = requestHelpers.RequestMethod;

export class WalletAccountQuery {
	public static readonly baseUrl = join(config.modules.query.moduleUrl, "/wallet-account");

	protected static isValidBech32Address(address: string): boolean {
		const decoded = bech32.decode(address)
		if (!decoded) {
			return false;
		}
		return true;
	}

	// if both isMainWallet and walletOrder args are left blank, return all wallets of the user
	public static async getMyWalletInfo(
		includeAddress: boolean = true,
		includeNickname: boolean = true,
		includeCryptoHdPath: boolean = true,
		isMainWallet: boolean = false,
		...walletOrder: number[] // This arg will be discarded if isMainWallet arg is true
	): Promise<ProtocolResponse> {
		const url: string = join(this.baseUrl, "/my-wallet");

		const requestConfig = {
			params: {
				"includeAddress": includeAddress?.toString(),
				"includeNickname": includeNickname?.toString(),
				"includeCryptoHdPath": includeCryptoHdPath?.toString(),
				"isMainWallet": isMainWallet?.toString(),
				"walletOrder": walletOrder?.toString(),
			}
		}
		

		try {
			const protoResponse: ProtocolResponse = await requestHelpers.request(
				RequestMethod.GET,
				url,
				undefined,
				requestConfig
			);
			return protoResponse;
		} catch (protoErr: ProtocolError | unknown) {
			throw protoErr;
		}
	}

	public static async findWallet(address: string): Promise<ProtocolResponse> {
		const url: string = join(this.baseUrl, "find");
		const requestConfig = {
			params: {
				"address": address,
			}
		}
		try {
			const protoResponse: ProtocolResponse = await requestHelpers.request(
				RequestMethod.GET,
				url,
				undefined,
				requestConfig
			);
			return protoResponse;
		} catch (protoErr: ProtocolError | unknown) {
			throw protoErr;
		}
	}
}