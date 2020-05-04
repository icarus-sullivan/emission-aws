const { wrapper } = require('@teleology/lambda-api');
const { pipeline } = require('../registry');

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

  const { eventKey, ...updates } = data;

  const { updates: mutations } = await pipeline({
    eventKey,
    $update: [updates],
  });

  return mutations[0];
};

export default wrapper(handler);
