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

  const { eventKey, ...addition } = data;

  const { additions } = await pipeline({
    eventKey,
    $add: [addition],
  });

  return additions[0];
};

export default wrapper(handler);
