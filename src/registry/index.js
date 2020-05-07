import dynamo from './dynamo';

export default dynamo({
  table: process.env.EVENT_TABLE,
  key: 'id',
  indexes: [
    {
      key: 'hid',
      value: 'HashGSI',
    },
  ],
});
