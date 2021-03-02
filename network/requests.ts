import { globalVariables } from "./globalVariables";
// import * as Sentry from "@sentry/react-native";
//
// Sentry.init({
//   dsn: "https://8dcbfde17da343aea2bb4986409dd43c@o524907.ingest.sentry.io/5638186",
//   enableInExpoDevelopment: true,
//   debug: true, // Sentry will try to print out useful debugging information if something goes wrong with sending an event. Set this to `false` in production.
// });

export const buildHeader = (secure?: boolean): HeadersInit => {
  const header = {
    'Content-Type': 'application/json',
    'Cache-Control': 'no-cache',
    // 'Accept': '*/*',
  };
  if (secure) {
    Object.assign(header, {
      Authorization: `Bearer ${globalVariables.accessToken}`,
    });
  }
  return header;
};

export const makeUrlKeyValuePairs = (json: {[key: string]: any}): string => {
  if (!json || Object.keys(json).length < 1) {
    return '';
  }
  const keys: string[] = Object.keys(json);
  let query = '?';
  for (let i = 0; i < keys.length; i += 1) {
    const key = keys[i];
    query +=
      encodeURIComponent(key) + '=' + encodeURIComponent(json[key]) + '&';
  }
  return query.replace(/&$/g, '');
};

type RequestObject = {
  type: 'GET' | 'POST' | 'PUT' | 'DELETE';
  isSecure?: boolean;
  queryParams?: {[key: string]: any};
  onResponse?: () => void;
  data?: {[key: string]: any};
  route: string;
};
export async function requestClan({
  onResponse,
  data,
  type = 'GET',
  queryParams,
  route,
  isSecure = false,
}: RequestObject): Promise<any> {
  console.log('✅ Making a request', data, type, queryParams, route, isSecure);
  let response: Response;
  const BASE_URL = '';

  // Handle get request with params
  let routePlusParams = route;
  if (queryParams) {
    routePlusParams += makeUrlKeyValuePairs(queryParams);
  }

  response = await fetch(routePlusParams.trim(), {
    method: type,
    headers: buildHeader(isSecure),
    body: type === 'POST' ? JSON.stringify(data) : null,
  });

  var response2 = response.clone();

  console.log(response.status)
  try {
    // TODO: log responses that are not 200
    if (response) {
      const responseJSON = await response.json();
      //console.log(responseJSON)
      return responseJSON;
    }
    return {exception: 'No response returned!'};
  } catch (error) {
    const dd = await response2.text();
    // TODO: Log error to sentry
    let errorMsg = 'An error occurred, please try again later.';
    console.log('✅ An error occurred, please try again later.', error.message, error.text, dd);
    return {
      message: errorMsg,
    };
  }
}
