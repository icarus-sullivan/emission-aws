import webhook from './webhook';
import unimplemented from './unimplemented';

const fanoutHandlers = {
  webhook,
  '*': unimplemented,
};

export default async ({ type, payload }) =>
  (fanoutHandlers[type] || fanoutHandlers['*'])(payload);
