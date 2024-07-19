import { ProtocolError, ProtocolResponse } from "thasa-wallet-interface";
import { requestHelpers } from "../helpers";
import { bech32 } from "bech32";
import { join } from "path";
import { walletServerUrl } from "../config";

const RequestMethod = requestHelpers.RequestMethod;

export class WalletAccountQuery {
	/**
	 * Base URL for user account queries.
	 */
	public static readonly baseUrl = join(walletServerUrl.modules.query.moduleUrl, "/wallet-account");

	/**
	 * Validates a Bech32-encoded address
	 * @param address The Bech32 address to validate.
	 * @returns `true` if the address is valid, `false` otherwise.
	 */
	protected static isValidBech32Address(address: string): boolean {
		const decoded = bech32.decode(address)
		if (!decoded) {
			return false;
		}
		return true;
	}

	/**
	 * Retrieves information about the current user's wallets.
	 * @param includeAddress Whether to include the wallet address in the response. Defaults to `true`.
	 * @param includeNickname Whether to include the wallet nickname in the response. Defaults to `true`.
	 * @param includeCryptoHdPath Whether to include the wallet's crypto HD path in the response. Defaults to `true`.
	 * @param isMainWallet Whether to only return the main wallet. Defaults to `false`.
	 * @param walletOrder An array of wallet orders to filter by. Only applicable if `isMainWallet` is `false`.
	 * @notice If both isMainWallet and walletOrder args are falsy/negative, return all wallets of the user
	 * @returns A `ProtocolResponseObject` indicating the query results
	 * @throws A `ProtocolError` object if the query fails
	 * 
	 * Example:
	 * ```
	 * // Get all wallets of user:
	 * const response = await WalletAccountQuery.getMyWalletInfo();
	 * console.log(response.data); // Output: [ { address: "thasa1...", nickname: "My Wallet 1", ... }, { address: "thasa2...", nickname: "My Wallet 2", ... } ]
	 * ```
	 * 
	 * More detailed examples at {@link https://github.com/ducmint864/ths-wallet-adapter}
	 */
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

	/**
	 * Finds a wallet by its address.
	 * @param address The Bech32 address of the wallet to find.
	 * @returns A `ProtocolResponse` object indicating the query results
	 * @throws A `ProtocolError` if the query fails
	 * 
	 * Example:
	 * ```
	 * const response = await WalletAccountQuery.findWallet("thasa1...");
	 * console.log(response.data); // Output: { address: "thasa1...", nickname: "My Wallet", ... }
	 * ```
	 * 
	 * More detailed examples at {@link https://github.com/ducmint864/ths-wallet-adapter}
	 */
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