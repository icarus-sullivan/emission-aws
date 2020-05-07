import { wrapper } from '@teleology/lambda-api';
import { merge } from 'lodash';
import fanout from '../fanout';

import hash from '../utils/hash';
import events from '../registry';

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

  const { hid, eventKey, payload } = data;

  // Get keyed consumers
  const consumers = await events.query({
    hid: hid || hash(eventKey),
  });

  // Merge incoming payload with possible consumer defaults
  const consumerEvents = consumers.map((it) => merge(it, { payload }));

  // fanout
  await Promise.all(consumerEvents.map(fanout));

  return { status: 'ok', success: true };
};

export default wrapper(handler);
