import crypto from 'crypto';

export default (v) =>
  crypto.createHash('sha1').update(JSON.stringify(v)).digest('hex');
