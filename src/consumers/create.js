// const { pipeline } = require('../registry');
import { v4 as uuid } from 'uuid';
import { wrapper } from '@teleology/lambda-api';
import hash from '../utils/hash';
import events from '../registry';

const handler = async ({ data }) => {
  const { eventKey, ...item } = data;

  return events.create({
    id: uuid(),
    hid: hash(eventKey),
    eventKey,
    ...item,
  });
};

export default wrapper(handler);
