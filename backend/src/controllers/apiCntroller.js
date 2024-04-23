const axios = require("axios");
const fs = require("fs");
const authenticate = require('./authController')

const { log } = require("../utils/logger");

const ANALYTICS_API_URL = process.env.ANALYTICS_API_URL; //"http://localhost:3001";
const tokenUrl = process.env.CHOREO_OAUTH_TOKEN_URL;
const clientId = process.env.CHOREO_OAUTH_CLIENT_ID;
const clientSecret = process.env.CHOREO_OAUTH_CLIENT_SECRET;

async function getAccessToken() {
  
  try {
      const accessToken = await authenticate(tokenUrl, clientId, clientSecret);
      return accessToken;
  } catch (error) {
      log.error('Error obtaining access token:', error);
      // For demo purposes retun dummy value, this for local testing
      return "abcdefghijklmnopqrst1234567890"
  }
}

const getAPIList = async () => {
  try {
    const accessToken = await getAccessToken();

    const response = await axios.get(`${ANALYTICS_API_URL}/api/v1/apis`, {
      headers: {
          'Authorization': `Bearer ${accessToken}`,
      }});

    return response.data;

  } catch (error) {
    log.error("Error fetching APIs: ", error);
    // For demo purpose, if the BE API fails return a dummy list
    return ["TransactionAPI", "CoverageAPI"];
  }
};

// Generates the 
async function generateReportContent(data, granularity, apiName, startDate, startTime, endDate, endTime) {
  let template = await readFileContent('./src/resources/LatencyWithPercentiles.tmpl')
  let sum = 0
  data.forEach(element => {
    sum += element.reqCount
  });

  var updatedContent = template.replace(/{{fromDate}}/g, startDate + ' ' + startTime).replace(/{{toDate}}/g, endDate + ' ' + endTime);
    updatedContent = updatedContent.replace(/{{GRANULARITY}}/g, granularity.toUpperCase());
    updatedContent = updatedContent.replace(/{{date}}/g, new Date().toString()).replace(/{{ API_NAME }}/g, apiName);
    updatedContent = updatedContent.replace(/{{ TOTAL_APPS }}/g, data.length).replace(/{{ TOTAL_REQ }}/g, sum);
    updatedContent = updatedContent.replace(/{{ APP_MAP }}/g,JSON.stringify(data));  

  return updatedContent;
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

    const { granularity, apiName, startDate, startTime, endDate, endTime } = req.params;
    const url = `${ANALYTICS_API_URL}/api/v1/data/summary/${granularity}/${apiName}/${startDate}/${startTime}/${endDate}/${endTime}`;
    const accessToken = await getAccessToken();

    const response = await axios.get(url, {
      headers: {
          'Authorization': `Bearer ${accessToken}`,
      }});
    log.info(response.data);
    let report = await generateReportContent(response.data, granularity, apiName, startDate, startTime, endDate, endTime);
    return report;
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
