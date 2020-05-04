import axios from 'axios';

export default async (payload) => {
  try {
    await axios(payload);
  } catch (e) {
    console.error('webhook', e);
  }
};
