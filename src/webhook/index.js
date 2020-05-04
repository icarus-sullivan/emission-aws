const { wrapper } = require('@teleology/lambda-api');

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

  return { success: true };
};

export default wrapper(handler);
