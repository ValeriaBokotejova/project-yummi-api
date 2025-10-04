import HttpError from '../utils/HttpError.js';

/**
 * Middleware to parse JSON strings and convert data types from multipart/form-data
 * Should be used after multer middleware and before validation
 */
const parseMultipartBody = (req, res, next) => {
  // Check if this is a multipart request by checking content-type or if multer processed it
  const isMultipart =
    req.headers['content-type']?.includes('multipart/form-data') ||
    req.file ||
    req.files ||
    Object.keys(req.body).length > 0;

  if (!isMultipart) {
    return next();
  }

  try {
    const body = req.body;

    for (const key in body) {
      if (Object.prototype.hasOwnProperty.call(body, key)) {
        const value = body[key];

        // Attempt to parse JSON strings
        if (typeof value === 'string') {
          try {
            body[key] = JSON.parse(value);
          } catch {
            // Not a JSON string, leave as is
            body[key] = value;
          }
        }
      }
    }

    req.body = body;

    next();
  } catch (error) {
    console.error('Error parsing multipart body:', error);
    next(HttpError(400, 'Invalid JSON format in form data'));
  }
};

export default parseMultipartBody;
