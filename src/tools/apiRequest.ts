import { getCookie } from './cookie';

type RequestParams = {
	url: string;
	method: 'POST' | 'GET';
	token: string;
	data: any;
};
type RequestOptions = {
	method: 'POST' | 'GET';
	headers: HeadersInit;
	body?: string;
};
export const apiRequest = async (
	{ url, method = 'GET', data }: RequestParams,
	token: any = false,
) => {
	const headers = {
		'Content-Type': 'application/json',
	};

	if (token) {
		// @ts-ignore
		headers['Authorization'] = `Token ${token}`;
	} else {
		// auth request
		// @ts-ignore
		headers['X-CSRFToken'] = getCookie('csrftoken');
	}

	const options: RequestOptions = { method, headers };
	if (data) {
		options.body = JSON.stringify(data);
	}

	// @ts-ignore
	const response = await fetch(`${API_URL}/${url}/`, options);
	if (response.status >= 400) {
		throw new Error(response.statusText);
	}
	return await response.json();
};
export default apiRequest;
