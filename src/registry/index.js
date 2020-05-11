import dynamo from '@teleology/dynamo';

export default dynamo({
  table: process.env.EVENT_TABLE,
  key: 'id',
  indexes: [
    {
      key: 'hid',
      name: 'HashGSI',
    },
  ],
});
