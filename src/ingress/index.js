const { v4: uuid } = require('uuid');

module.exports.handler = async (evt) => {
  const { id = uuid(), type, payload } = evt;

  // validate
  if (type === 'ignore') {
    throw new Error('Ignoring event', evt);
  }

  return {
    statusCode: '200',
    body: '',
  };
};
