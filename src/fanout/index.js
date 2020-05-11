import webhook from './webhook';
import lambda from './lambda';
import sms from './sms';
import unimplemented from './unimplemented';

const fanoutHandlers = {
  webhook,
  lambda,
  sms,
  '*': unimplemented,
};

export default async ({ id, type, payload }) => {
  try {
    await (fanoutHandlers[type] || fanoutHandlers['*'])(payload);
  } catch (e) {
    console.error(
      JSON.stringify(
        {
          id,
          message: e.message,
          stack: e.stack,
        },
        null,
        2,
      ),
    );
  }
};
