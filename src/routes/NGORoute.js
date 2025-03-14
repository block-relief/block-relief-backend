const express = require('express');
const ngoRouter = express.Router();
const { submitNGODocsController, getNGODocsController, listVerifiedNGOsController } = require('../controller/NGOController');
const { upload } = require('../middleware/multerConfig');

ngoRouter.post('/submit-docs', upload.fields([
    { name: 'registration', maxCount: 1 },
    { name: 'tax_cert', maxCount: 1 },
    { name: 'proof_of_op', maxCount: 1 }
  ]), submitNGODocsController);
ngoRouter.get('/docs/:userHash', getNGODocsController);
ngoRouter.get('/verified', listVerifiedNGOsController);

module.exports = ngoRouter;