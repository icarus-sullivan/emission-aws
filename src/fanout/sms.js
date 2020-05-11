import AWS from 'aws-sdk';

const SNS = new AWS.SNS({ apiVersion: '2010-03-31' });

export default async ({ phone, message, ...rest }) => {
  // Set correct smsType
  await SNS.setSMSAttributes({
    attributes: {
      DefaultSMSType: 'Transactional',
    },
  }).promise();

  return SNS.publish({
    PhoneNumber: phone,
    Message: typeof message === 'string' ? message : JSON.stringify(message),
  }).promise();
};
