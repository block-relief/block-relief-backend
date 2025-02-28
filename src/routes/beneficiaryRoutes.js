const express = require("express");
const { registerBeneficiary, listVerifiedBeneficiariesController } = require("../controller/beneficiaryController");

const beneficiaryRouter = express.Router();

beneficiaryRouter.post("/register", registerBeneficiary);
beneficiaryRouter.get('/verified', listVerifiedBeneficiariesController);

module.exports = beneficiaryRouter;
