const axios = require("axios");
const fs = require("fs");

const { log } = require("../utils/logger");

const ANALYTICS_API_URL = process.env.ANALYTICS_API_URL; //"http://localhost:3001/api/v1";

const getAPIList = async () => {
  try {
    const response = await axios.get(`${ANALYTICS_API_URL}/apis`);
    return response.data;
  } catch (error) {
    console.error("Error fetching APIs:", error);
    return ["TransactionAPI", "CoverageAPI"];
  }
};

async function generateReportContent(data) {
  return null;
}

async function readFileContent(filePath) {
    return new Promise((resolve, reject) => {
      fs.readFile(filePath, "utf8", (err, data) => {
        if (err) {
          reject(err);
        } else {
          resolve(data);
        }
      });
    });
  }

async function generateReport(req, res) {
  try {
    const response = await axios.get("https://api.example.com/data", {
      params: req.query,
    });
    log.info(response.data);
    let report = generateReportContent(response.data);
    res.send(report);
  } catch (error) {
    log.error("Error occured: " + error)
    // This is for the demo, if the backend fails we will send a dummy report, for demo purpose
    const filePath = "./src/resources/LatencyWithPercentiles.html";

    const data = await readFileContent(filePath);

    return data;
  }
}

module.exports = {
  getAPIList,
  generateReport,
};
