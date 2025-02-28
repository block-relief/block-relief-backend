require("dotenv").config();

class ENVs {
  MONGOURL = process.env.MONGOURL;
  ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
  REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;
  PUBLIC_KEY = process.env.PUBLIC_KEY;
  PRIVATE_KEY = process.env.PRIVATE_KEY;
  URL_ENDPOINT = process.env.URL_ENDPOINT;
  BASEURL = process.env.BASEURL;
  OTHER_EMAILS = process.env.OTHER_EMAILS;
  PORT = process.env.PORT
  JWT_SECRET = process.env.JWT_SECRET;
  JWT_EXPIRATION = process.env.JWT_EXPIRATION;
  EMAIL_PASS = process.env.EMAIL_PASS
  EMAIL_USER = process.env.EMAIL_USER
  CLOUD_NAME = process.env.CLOUD_NAME;
  CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET
  CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY
  HASH_SALT = process.env.HASH_SALT
  USER_CANISTER_ID = process.env.USER_CANISTER_ID
}

const config = new ENVs();

module.exports = {
  config,
};
