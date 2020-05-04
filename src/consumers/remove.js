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

  const { eventKey, ...removal } = data;

  const { removals } = await pipeline({
    eventKey,
    $remove: [removal],
  });

  return removals[0];
};

export default wrapper(handler);
