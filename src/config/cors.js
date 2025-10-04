import cors from 'cors';

export default function setupCors() {
  const isProd = process.env.NODE_ENV === 'production';

  const list = (process.env.CORS_ORIGIN || '')
    .split(',')
    .map(s => s.trim())
    .filter(Boolean);

  const origin = list.length === 0
    ? (isProd ? false : true)
    : list;

  const credentials = /^(1|true|yes|on)$/i.test(process.env.CORS_CREDENTIALS || 'false');

  return cors({
    origin,
    credentials: credentials && origin !== true,
  });
}