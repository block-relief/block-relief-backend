const express = require('express');
const aidRequestRouter = express.Router();
const { requestAid, getAllAidRequests } = require('../controller/aidRequestController')

aidRequestRouter.post('/requestAid', requestAid);
aidRequestRouter.get('/getAllAidRequests', getAllAidRequests);

module.exports = aidRequestRouter;