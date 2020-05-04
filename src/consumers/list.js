const { wrapper } = require('@teleology/lambda-api');
const { getRegistry } = require('../registry');

const handler = async ({ headers, data }) => {
  console.log(
    JSON.stringify(
      {
        headers,
        data,
      },
      null,
      2,
    ),
  );

  const { eventKey } = data;

  return getRegistry({ eventKey });
};

export default wrapper(handler);
