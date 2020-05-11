import AWS from 'aws-sdk';

const L = new AWS.Lambda({ apiVersion: '2015-03-31' });

export default async ({ name, ...rest }) =>
  L.invoke({
    FunctionName: name,
    Payload: JSON.stringify(rest),
    InvocationType: 'Event',
  }).promise();
