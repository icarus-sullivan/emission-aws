import { wrapper, ApiError } from '@teleology/lambda-api';
import events from '../registry';

const handler = async ({ data }) => {
  if (!data.id) {
    throw new ApiError('An id is required to get this resource');
  }

  return events.get(data.id);
};

export default wrapper(handler);
