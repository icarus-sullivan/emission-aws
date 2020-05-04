import fanout from '../fanout';

const { wrapper } = require('@teleology/lambda-api');
const { merge } = require('lodash');
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

  const { eventKey, payload } = data;

  // Get keyed consumers
  const consumers = await getRegistry({ eventKey });

  // Convert to array
  const consumersArray = Object.values(consumers);

  // Merge incoming payload with possible consumer defaults
  const consumerEvents = consumersArray.map((it) => merge(it, { payload }));

  // fanout
  await Promise.all(consumerEvents.map(fanout));

  return { status: 'ok', success: true };
};

export default wrapper(handler);
