import AWS from 'aws-sdk';

const ddb = new AWS.DynamoDB.DocumentClient({
  apiVersion: '2012-08-10',
});

const getter = async ({ table, key, value }) => {
  const response = await ddb
    .get({
      TableName: table,
      Key: {
        [key]: value,
      },
    })
    .promise();

  if (response && response.Item) return response.Item;
};

const updater = async ({ table, key, value, item }) => {
  if (!key || !value) {
    throw new Error('A primary key is needed to update a record');
  }

  const { Attributes = {} } = await ddb
    .put({
      TableName: table,
      Item: item,
      ReturnValues: 'ALL_OLD',
    })
    .promise();

  return {
    ...Attributes,
    ...item,
  };
};

const creator = async ({ table, key, value, item }) => {
  const exists = await getter({ table, key, value });
  if (exists) {
    throw new Error(`A record already exists with that ${key}`);
  }

  return updater({ table, key, value, item });
};

const destroy = async ({ table, key, value }) =>
  ddb
    .delete({
      TableName: table,
      Key: {
        [key]: value,
      },
    })
    .promise();

const queryBuilder = async ({ table, key, value, indexes }) => {
  const foundIndex = indexes.find((it) => it.key === key);
  if (!foundIndex) {
    throw new Error('No index found for key', key);
  }

  const response = await ddb
    .query({
      TableName: table,
      IndexName: foundIndex.value,
      KeyConditionExpression: `${key} = :${key}`,
      ExpressionAttributeValues: {
        [`:${key}`]: value,
      },
    })
    .promise();

  console.log('querying', {
    table,
    key,
    value,
    indexes,
    response,
  });
  return response && response.Items ? response.Items : [];
};

export default ({ table, key, indexes }) => ({
  get: (value) =>
    getter({
      table,
      key,
      value,
    }),

  create: (item) => {
    const { [key]: value } = item;

    return creator({ table, key, value, item });
  },

  update: (item) => {
    const { [key]: value } = item;
    return updater({ table, key, value, item });
  },

  delete: (value) =>
    destroy({
      table,
      key,
      value,
    }),

  query: (keyVal) => {
    const [firstKey] = Object.keys(keyVal);
    return queryBuilder({
      table,
      indexes,
      key: firstKey,
      value: keyVal[firstKey],
    });
  },
});
