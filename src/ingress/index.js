import { wrapper } from '@teleology/lambda-api';
import { merge } from 'lodash';
import fanout from '../fanout';

import hash from '../utils/hash';
import events from '../registry';

const handler = async ({ hid, type, payload = {} }) => {
  // Get keyed consumers
  const consumers = await events.query({
    hid: hid || hash(type),
  });

  // Merge incoming payload with possible consumer defaults
  const consumerEvents = consumers.map((it) => merge(it, { payload }));

  // fanout
  const results = await Promise.all(consumerEvents.map(fanout));

  return results.filter(Boolean);
};

export default wrapper(handler);
