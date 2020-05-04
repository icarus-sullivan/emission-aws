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

  const { eventKey } = data;

  return pipeline({
    eventKey,
    $delete: true,
  });
};

export default wrapper(handler);
