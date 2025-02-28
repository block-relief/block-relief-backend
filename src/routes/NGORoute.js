const express = require('express');
const ngoRouter = express.Router();
const { registerNGOController, submitNGODocsController, getNGODocsController, listVerifiedNGOsController } = require('../controller/NGOController');
const { upload } = require('../middleware/multerConfig');

ngoRouter.post('/register', registerNGOController);
ngoRouter.post('/submit-docs', upload.array('documents', 3), submitNGODocsController); 
ngoRouter.get('/docs/:userHash', getNGODocsController);
ngoRouter.get('/verified', listVerifiedNGOsController);

module.exports = ngoRouter;