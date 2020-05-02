const { v4: uuid } = require('uuid');
const { keyBy, merge } = require('lodash');

const existingId = uuid();
const toRemove = uuid();

const s3 = {
  'event@1.0.0': Buffer.from(
    JSON.stringify(
      [
        {
          id: existingId,
          type: 'https',
          payload: {
            method: 'post',
            url: 'fake_url_here',
            params: {},
          },
        },
        {
          id: toRemove,
          type: 'corrupted',
        },
      ],
      null,
      2,
    ),
  ).toString('utf8'),
};

const findOrCreate = (params) => {
  try {
    return JSON.parse(s3[params.Key]) || [];
  } catch (e) {
    console.error('creating new for', params);
    return [];
  }
};

const save = (params) => {
  s3[params.Key] = params.Body;
};

const remove = (params) => {
  try {
    delete s3[params.Key];
  } catch (e) {
    console.error('remove', e);
  }
};

const pipeline = ({
  key,
  $add = [],
  $update = [],
  $remove = [],
  $delete = false,
}) => {
  const baseParams = {
    Bucket: process.env.REGISTRY_BUCKET || 'fake_bucket',
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

  const existing = findOrCreate(baseParams);

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

  save({
    ...baseParams,
    Body: JSON.stringify(Object.values(workingSet), null, 2),
  });

  return {
    additions: mappedAdditions.length > 0 ? mappedAdditions : [],
    removals: $remove.length > 0 ? $remove : [],
    updates: $update.length > 0 ? $update.map((it) => workingSet[it.id]) : [],
  };
};

const result = pipeline({
  key: 'event@1.0.0',
  $add: [
    {
      type: 'lambda',
      payload: {
        functionName: 'foo',
        stage: 'dev',
      },
    },
  ],
  $update: [
    {
      id: existingId,
      payload: {
        params: {
          token: '12345678999',
        },
      },
    },
  ],
  $remove: [
    {
      id: toRemove,
    },
  ],
});

console.log('result', JSON.stringify(result, null, 2));

console.log('s3', s3);
