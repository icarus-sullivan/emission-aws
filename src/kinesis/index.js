const AWS = require('aws-sdk');

const K = new AWS.Kinesis({ apiVersion: '2013-12-02' });

// Auto format data for kinesis
const formatData = (s) =>
  Buffer.isBuffer(s) || typeof s === 'string' ? s : JSON.stringify(s);

// Proxy batch write to Kinesis
const batch = ({ streamName, items }) =>
  K.putRecords({
    Records: items.map(({ id, content }) => ({
      Data: formatData(content),
      PartitionKey: id,
    })),
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
