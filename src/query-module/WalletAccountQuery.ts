import { ProtocolError, ProtocolResponse } from "thasa-wallet-interface";
import { requestHelpers } from "../helpers";
import { bech32 } from "bech32";
import { join } from "path";
import { walletServerUrl } from "../config";
import { Coin } from "thasa-wallet-interface";
import { StargateClient } from "@cosmjs/stargate";

const RequestMethod = requestHelpers.RequestMethod;

export class WalletAccountQuery {
	/**
	 * Base URL for user account queries.
	 */
	public static readonly baseUrl = join(walletServerUrl.modules.query.moduleUrl, "/wallet-account");

	/**
	 * Validates a Bech32-encoded address`
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
	 * ```typescript
	 * // Get all wallets of user:
	 * const response = await WalletAccountQuery.getMyWalletInfo();
	 * console.log(response.data.wallets); // Output: 
	 * 	    wallets: [ 
	 * 		    { address: "thasa1...", nickname: "My Wallet 1", ... },
	 *  	    { address: "thasa2...", nickname: "My Wallet 2", ... }
	 * 	    ]
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
	 * @param includeBalances Whether to include the wallet's balances in the response. Defaults to `false`.
	 * @returns A `ProtocolResponse` object indicating the query results
	 * @throws A `ProtocolError` if the address isn't valid or the query fails
	 * @notice The `data` object inside the returned `ProtocolResponse` object:
	 * ```JSON
	 * {
	 * 	address: "thasa1akb2...",
	 * 	nickname: "Crypto Ant", // Only available if user owns this wallet.
	 * 	walletAccountId: 19, // Only available if user had created wallet via Thasa Wallet app
	 * 	userAccountId: 1 // Only available if user had created wallet via Thasa Wallet app
	 * }
	 * ``` 
	 * Example:
	 * ```
	 * const response = await WalletAccountQuery.findWallet("thasa1...");
	 * console.log(response.data); // Output: { address: "thasa1...", nickname: "My Wallet", ... }
	 * ```
	 * 
	 * More detailed examples at {@link https://github.com/ducmint864/ths-wallet-adapter}
	 */
	public static async getWalletInfo(
		address: string,
		includeBalances: boolean = false
	): Promise<ProtocolResponse> {
		// Verify address
		if (!this.isValidBech32Address(address)) {
			throw new ProtocolError("Invalid Bech32 address", 400, ProtocolError.ERR_BAD_REQUEST);
		}

		// Make queries
		const url: string = join(this.baseUrl, "/find");
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

			// Check for anomaly in response data
			if (!protoResponse.data) {
				throw new ProtocolError("Response data is empty due to unknown error", 500, ProtocolError.ERR_BAD_RESPONSE);
			}

			// Get address' balances
			if (includeBalances) {
				const balances: readonly Coin[] = await this.getBalances(address);
				protoResponse.data.balances = balances;
			}

			return protoResponse;

		} catch (protoErr: ProtocolError | unknown) {
			throw protoErr;
		}
	}

	private static async getBalances(address: string): Promise<readonly Coin[]> {
		const url = "http://localhost:26657";
		const client: StargateClient = await StargateClient.connect(url);
		const coins = await client.getAllBalances(address);
		console.log(coins);
		return coins
	}
}