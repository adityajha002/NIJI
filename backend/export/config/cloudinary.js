require('dotenv').config();
const https = require('https');
const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

const hasCloudinaryConfig = () => {
  return Boolean(
    process.env.CLOUD_NAME &&
    process.env.CLOUD_API_KEY &&
    process.env.CLOUD_API_SECRET
  );
};

let timestampOffsetSeconds = null;

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const isRetryableUploadError = (error) => {
  return ['ECONNRESET', 'ETIMEDOUT', 'EAI_AGAIN', 'ENOTFOUND'].includes(error?.code);
};

const getCloudinaryTimestamp = () => {
  if (timestampOffsetSeconds !== null) {
    return Promise.resolve(Math.floor(Date.now() / 1000) + timestampOffsetSeconds);
  }

  return new Promise((resolve) => {
    const req = https.request(
      {
        method: 'HEAD',
        hostname: 'api.cloudinary.com',
        path: '/',
      },
      (res) => {
        const serverDate = res.headers.date ? Date.parse(res.headers.date) : NaN;
        const localTimestamp = Math.floor(Date.now() / 1000);

        if (Number.isNaN(serverDate)) {
          resolve(localTimestamp);
          return;
        }

        timestampOffsetSeconds = Math.floor(serverDate / 1000) - localTimestamp;
        resolve(localTimestamp + timestampOffsetSeconds);
      }
    );

    req.on('error', () => resolve(Math.floor(Date.now() / 1000)));
    req.setTimeout(5000, () => {
      req.destroy();
      resolve(Math.floor(Date.now() / 1000));
    });
    req.end();
  });
};

const uploadImageBuffer = async (buffer, folder = 'niji/shops') => {
  if (!hasCloudinaryConfig()) {
    throw new Error('Cloudinary credentials are not configured');
  }

  const timestamp = await getCloudinaryTimestamp();
  const maxAttempts = 3;

  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    try {
      return await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder, resource_type: 'image', timestamp, timeout: 60000 },
          (error, result) => {
            if (error) {
              reject(error);
              return;
            }

            resolve(result);
          }
        );

        stream.on('error', reject);
        stream.end(buffer);
      });
    } catch (error) {
      const shouldRetry = attempt < maxAttempts && isRetryableUploadError(error);

      if (!shouldRetry) {
        throw error;
      }

      console.warn(`Cloudinary upload attempt ${attempt} failed: ${error.code}. Retrying...`);
      await delay(attempt * 1000);
    }
  }
};

module.exports = {
  cloudinary,
  hasCloudinaryConfig,
  uploadImageBuffer,
};
