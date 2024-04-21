import axios from 'axios';

// Replace `APPOINTMENT_SERVICE_URL` with the actual URL of your appointments service
const REPORT_API_URL = 'http://localhost:8080/api/v1';


const getAPIList = async () => {

    try {
      const response = await axios.get(`${REPORT_API_URL}/apis`);
      console.log("XXXXXXXXXXX : " + response.data)
      return response.data;
    } catch (error) {
      console.error('Error fetching APIs:', error);
      return ["TransactionAPI", "CoverageAPI"];
    }
  };


const downloadReportZip = async (reportType, selectedInterval, selectedAPI, startTime, endTime) => {
  try {
    
    const response = await axios.get(`${REPORT_API_URL}/report`, {
      params: {
        'granularity': selectedInterval.toLowerCase(),
        'apiName': selectedAPI,
        'startDate': startTime.toISOString().slice(0, 10),
        'startTime': startTime.toISOString().slice(11, 16),
        'endDate': endTime.toISOString().slice(0, 10),
        'endTime': endTime.toISOString().slice(11, 16)    
      },
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