import { join } from "path";
import { topLevelUrl } from ".";

export const config = {
	topLevelUrl: "/api",
	modules: {
		auth: {
			moduleUrl: join(topLevelUrl, "/auth")
		},
		query: {
			moduleUrl: join(topLevelUrl, "/query")
		},
		transaction: {
			moduleUrl: join(topLevelUrl, "/transaction")
		}
	}
}
