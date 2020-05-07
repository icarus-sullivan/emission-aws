import { wrapper, ApiError } from '@teleology/lambda-api';
import events from '../registry';

const handler = async ({ data }) => {
  if (!data.hash) {
    throw new ApiError('Hash field required');
  }

  try {
    return events.query({
      hid: data.hash,
    });
  } catch (e) {
    throw new ApiError(e.message, {
      data,
    });
  }
};

export default wrapper(handler);
