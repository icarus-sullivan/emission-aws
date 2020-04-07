const AWS = require('aws-sdk');

const K = new AWS.Kinesis({ apiVersion: '2013-12-02' });

const batchRecordMap = ({ id, content }) => ({
  Data:
    Buffer.isBuffer(content) || typeof content === 'string'
      ? content
      : JSON.stringify(content),
  PartitionKey: id,
});

// Proxy batch write to Kinesis
const batch = ({ streamName, items }) =>
  K.putRecords({
    Records: items.map(batchRecordMap),
    StreamName: streamName,
  }).promise();

// Set up kinesis factory, initialize w/streamName
module.exports = ({ streamName }) => ({
  write: async (arg) =>
    batch({
      streamName,
      items: Array.isArray(arg) ? arg : [arg],
    }),
});
