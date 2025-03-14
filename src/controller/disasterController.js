const disasterService = require("../services/disasterService");

async function reportDisaster(req, res) {
  try {
    const { name, type, location, severity } = req.body;
    const reportedBy = req.user.userId; 
    const disaster = await disasterService.reportDisaster({
      name,
      type,
      location,
      severity,
      reportedBy,
    });
    res.status(201).json(disaster);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function listAllDisasters(req, res) {
  try {
    const disasters = await disasterService.listAllDisasters();
    res.status(200).json(disasters);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function getDisaster(req, res) {
  try {
    const { disasterId } = req.params;
    const disaster = await disasterService.getDisaster(disasterId);
    res.status(200).json(disaster);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
}

async function getProposalsByDisaster(req, res) {
  try {
    const { disasterId } = req.params
    console.log('disaster id received: ', disasterId)
    const proposals = await disasterService.getProposalByDisaster(disasterId)
    res.status(200).json(proposals)
  } catch (error) {
    res.status(404).json({ error: error.message })
  }
}

module.exports = { reportDisaster, listAllDisasters, getDisaster, getProposalsByDisaster };