// const { pipeline } = require('../registry');
import { v4 as uuid } from 'uuid';
import { wrapper } from '@teleology/lambda-api';
import hash from '../utils/hash';
import events from '../registry';

const handler = async ({ data }) => {
  const { subscription, ...item } = data;

  return events.create({
    id: uuid(),
    hid: hash(subscription),
    subscription,
    ...item,
  });
};

export default wrapper(handler);
