import fetch from "isomorphic-fetch";
//import { serverURL } from "./appConfig";

function isDevelopment() {
	return process.env.NODE_ENV === "development";
}

function parseJSON(response) {
	return response.json().then(function(json) {
		const newResponse = Object.assign(response, { json });
		if (response.status < 300) {
			return newResponse;
		} else {
			throw newResponse.json;
		}
	});
}



function fetchResp(fullUri, fetchOpts, isDev) {
	return fetch(fullUri, fetchOpts)
		.then(parseJSON)
		.then(resp => resp.json)
		.catch(err => {
			let errorMessage =
				err.message || (err.json && err.json.message) || err.json || err;
			throw new Error(errorMessage);
		});
}

var flureeFetch = (uri, body) => {
	const isDev = isDevelopment();
	const gateway = isDev
		? "http://localhost:8080/fdb"
		: "https://db.flur.ee/api/db";
	const db = isDev ? "/test/post-appv6" : "/tcdemo/test";
	let fullUri;
	if (uri === "/new-db") {
		fullUri = gateway + uri;
	} else if (!isDev && uri === "/dbs") {
		fullUri = gateway + "s";
	} else if (isDev && uri === "/dbs") {
		fullUri = gateway + "/dbs";
	} else {
		fullUri = gateway + db + uri;
	}

	var fetchOpts = {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(body)
	};

	return new Promise((resolve, reject) => {
		if (!isDev) {
			console
				.log("devmode")
				.then(res => (fetchOpts.headers["Authorization"] = `Bearer ${res}`))
				.then(res => fetchResp(fullUri, fetchOpts))
				.then(res => {
					console.log(res);
					if (Object.keys(res).includes("result")) {
						return resolve(res.result);
					} else {
						return resolve(res);
					}
				})
				.catch(err => reject(err));
		} else {
			fetchResp(fullUri, fetchOpts)
				.then(res => resolve(res))
				.catch(err => reject(err));
		}
	});
};

export { flureeFetch, parseJSON };
