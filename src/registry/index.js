const AWS = require('aws-sdk');
const { v4: uuid } = require('uuid');
const { keyBy, merge } = require('lodash');

const NON_ALPHANUMERIC_CHARS = /[^A-Z0-9]/gi;
const S3 = new AWS.S3({ apiVersion: '2006-03-01' });

const formatEventKey = (eventKey) =>
  `${eventKey.replace(NON_ALPHANUMERIC_CHARS, '_')}.json`;

const findOrDefault = async (params) => {
  try {
    const { Body } = await S3.getObject(params).promise();

    console.error('existing record for', params);
    return JSON.parse(Buffer.from(Body, 'utf8'));
  } catch (e) {
    console.error('creating new for', params);
    return {};
  }
};

const save = async (params) => {
  try {
    console.log('saving', JSON.stringify(params, null, 2));
    await S3.putObject(params).promise();
  } catch (e) {
    console.error('save', e);
  }
};

const remove = async (params) => {
  try {
    await S3.deleteObject(params).promise();
  } catch (e) {
    console.error('remove', e);
  }
};

const getRegistry = ({ eventKey }) =>
  findOrDefault({
    Bucket: process.env.REGISTRY_BUCKET,
    Key: formatEventKey(eventKey),
  });

const pipeline = async ({
  eventKey,
  $add = [],
  $update = [],
  $remove = [],
  $delete = false,
}) => {
  const baseParams = {
    Bucket: process.env.REGISTRY_BUCKET,
    Key: formatEventKey(eventKey),
  };

  if ($delete) {
    return remove(baseParams);
  }

  // Add id's for new additions
  const mappedAdditions = $add.map((it) => ({
    id: uuid(),
    ...it,
  }));

  const existing = await findOrDefault(baseParams);

  // Actuall add additions to our working set
  const workingSet = {
    ...existing,
    ...keyBy(mappedAdditions, 'id'),
  };

  // Update workingSet values
  $update.forEach((it) => {
    workingSet[it.id] = merge(workingSet[it.id], it);
  });

  // Remove ids
  $remove.forEach((it) => {
    delete workingSet[it.id];
  });

  await save({
    ...baseParams,
    Body: JSON.stringify(workingSet, null, 2),
    ContentType: 'application/json',
  });

  return {
    additions: $add.length > 0 ? mappedAdditions : undefined,
    removals: $remove.length > 0 ? $remove : undefined,
    updates:
      $update.length > 0 ? $update.map((it) => workingSet[it.id]) : undefined,
  };
};

module.exports = {
  pipeline,
  getRegistry,
};
