function getCsrfToken(): string | null {
	const cookies = document.cookie.split("");
	for (const cookie of cookies) {
		const [key, value] = cookie.trim().split("=");
		if (key === "csrfToken") {
			return value;
		}
	}

	return null;
}

export {
	getCsrfToken,
}