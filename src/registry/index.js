const AWS = require('aws-sdk');
const { v4: uuid } = require('uuid');
const { keyBy, merge } = require('lodash');

const S3 = new AWS.S3({ apiVersion: '2006-03-01' });

const findOrCreate = async (params) => {
  try {
    const { Body } = await S3.getObject(params).promise();

    console.error('existing record for', params);
    return JSON.parse(Buffer.from(Body, 'utf8'));
  } catch (e) {
    console.error('creating new for', params);
    return [];
  }
};

const save = async (params) => S3.putObject(params).promise();

const remove = async (params) => {
  try {
    await S3.deleteObject(params).promise();
  } catch (e) {
    console.error('remove', e);
  }
};

module.exports = async ({
  key,
  $add = [],
  $update = [],
  $remove = [],
  $delete = false,
}) => {
  const baseParams = {
    Bucket: process.env.REGISTRY_BUCKET,
    Key: key,
  };

  if ($delete) {
    return remove(baseParams);
  }

  // Add id's for new additions
  const mappedAdditions = $add.map((it) => ({
    id: uuid(),
    ...it,
  }));

  const existing = await findOrCreate(baseParams);

  // Actuall add additions to our working set
  const addMutation = [...existing, ...mappedAdditions];
  const workingSet = keyBy(addMutation, 'id');

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
    Body: JSON.stringify(Object.values(workingSet), null, 2),
  });

  return {
    additions: mappedAdditions.length > 0 ? mappedAdditions : undefined,
    removals: $remove.length > 0 ? $remove : undefined,
    updates:
      $update.length > 0 ? $update.map((it) => workingSet[it.id]) : undefined,
  };
};
