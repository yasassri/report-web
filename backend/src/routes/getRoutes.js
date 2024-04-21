const express = require('express');
const router = express.Router();
const apiController = require('../controllers/apiCntroller')
const { log } = require("../utils/logger")
const { GRANULARITY } = require("../Constants")

router.get('/apis', async (req, res) => {
    let apis = await apiController.getAPIList();
    return res.json(apis);
});


router.get('/report', async (req, res) => {

    const { granularity, apiName, startDate, startTime, endDate, endTime } = req.query;
    if (!granularity || !apiName || !startDate || !startTime || !endDate || !endTime) {
        return res.status(400).json({ error: 'Missing query parameters' });
    }

    // Check if granularity is provided and valid
    if (!Object.values(GRANULARITY).includes(granularity)) {
        return res.status(400).json({ error: 'Invalid granularity' });
    }

    try {
       
        let latencyData = await apiController.generateReport(req, res);
        log.info(latencyData)
        res.send(latencyData);

    } catch (error) {
        log.error(error);
        return res.status(500).json({ error: 'Missing query parameters' });
    }

});

module.exports = router;
