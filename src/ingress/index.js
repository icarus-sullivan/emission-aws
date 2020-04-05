const { v4: uuid } = require('uuid');
const kinesis = require('../kinesis');

const stream = kinesis({ streamName: process.env.FIREHOSE_NAME });

module.exports.handler = async (evt) => {
  const { type, payload } = evt;

  // validate
  if (type === 'ignore') {
    throw new Error('Ignoring event', evt);
  }

  await stream.write({
    id: uuid(),
    content: { type, payload },
  });

  return {
    statusCode: '200',
    body: '',
  };
};
