const { registerNGO, submitNGODocs, getNGODocs, listVerifiedNGOs } = require("../services/ngoService");

async function registerNGOController(req, res) {
  const { email, password, name, registrationNumber, phone, address, country, contactPerson } = req.body;

  try {
    const result = await registerNGO(email, password, name, registrationNumber, phone, address, country, contactPerson);
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function submitNGODocsController(req, res) {
  const { userHash } = req.body;
  const files = req.files; // From Multer

  try {
    const result = await submitNGODocs(userHash, files);
    res.status(200).json(result);
  } catch (error) {
    res.status(error.message.includes("not found") ? 404 : 500).json({ error: error.message });
  }
}

async function getNGODocsController(req, res) {
  const { userHash } = req.params;

  try {
    const result = await getNGODocs(userHash);
    res.status(200).json(result);
  } catch (error) {
    res.status(error.message.includes("not found") ? 404 : 500).json({ error: error.message });
  }
}

async function listVerifiedNGOsController(req, res) {
  try {
    const ngos = await listVerifiedNGOs();
    res.status(200).json({ ngos });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

module.exports = { registerNGOController, submitNGODocsController, getNGODocsController, listVerifiedNGOsController };