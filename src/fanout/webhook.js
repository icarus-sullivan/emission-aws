import axios from 'axios';

// Pull out specifically applies to this fanout type
export default async ({ url, method, data, params, headers }) =>
  axios({
    url,
    method,
    data,
    params,
    headers,
  });
