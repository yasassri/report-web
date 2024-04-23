import axios from 'axios';

const REPORT_API_URL = window.configs.apiUrl;


const getAPIList = async () => {

    try {
      const response = await axios.get(`${REPORT_API_URL}/api/v1/apis/apis`);
      console.log("XXXXXXXXXXX : " + response.data)
      return response.data;
    } catch (error) {
      console.error('Error fetching APIs:', error);
      return ["TransactionAPI", "CoverageAPI"];
    }
  };


const downloadReportZip = async (reportType, selectedInterval, selectedAPI, startTime, endTime) => {
  try {

    const granularity = selectedInterval.toLowerCase();
    const apiName = selectedAPI;
    const startDateF = startTime.toISOString().slice(0, 10);
    const startTimeF = startTime.toISOString().slice(11, 16);
    const endDateF = endTime.toISOString().slice(0, 10);
    const endTimeF = endTime.toISOString().slice(11, 16);
    
    const response = await axios.get(`${REPORT_API_URL}/api/v1/report/${granularity}/${apiName}/${startDateF}/${startTimeF}/${endDateF}/${endTimeF}`, {
      responseType: 'blob' 
    });

    console.log("CCCC: " + response.data)
    // if (!response.ok) {
    //   const message = `An error has occurred: ${response.status}`;
    //   throw new Error(message);
    // }

    return response.data;
  } catch (error) {
    console.log(error)
    return [];
  }
};



export { getAPIList, downloadReportZip }