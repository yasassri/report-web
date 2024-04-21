import React, { useState, useEffect } from "react";
import { getAPIList, downloadReportZip } from "../services/ReportService";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const ReportsPage = () => {
  const [selectedInterval, setSelectedInterval] = useState("HOUR");
  const [selectedAPI, setSelectedAPI] = useState("TransactionAPI");
  const [startTime, setStartTime] = useState(new Date('2024-04-17T00:00:00'));
  const [endTime, setEndTime] = useState(new Date('2024-04-20T00:00:00'));
  const [error, setError] = useState("");
  const [options, setOptions] = useState([]);
  const [reportType, setreportType] = useState("Latency Report");
  const [htmlContent, setHtmlContent] = useState("");
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getAPIList(); 

        const optionMap = data.map((element, index) => {
          return {
            id: index + 1,
            label: element,
            value: element,
          };
        });
        console.log(optionMap);
        setOptions(optionMap);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handleChange = (event) => {
    //setreportType(event.target.value);
  };

  const validateTimeRange = () => {
    return startTime < endTime;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validateTimeRange()) {
      setError("Start time must be before end time");
      return;
    }
    // console.log("Selected option:", reportType);
    // console.log("Selected interval:", selectedInterval);
    // console.log("Selected API:", selectedAPI);
    // console.log("Start time:", startTime);
    // console.log("End time:", endTime);
    // console.log(typeof startTime);
    const data = await downloadReportZip(
      reportType,
      selectedInterval,
      selectedAPI,
      startTime,
      endTime
    );

    setHtmlContent(data);

    // Set the flag to true indicating report is generated
    setShowPopup(true);

    setError("");
    setreportType("");
    setSelectedInterval("");
    setSelectedAPI("");
    setStartTime(null);
    setEndTime(null);
  };

  const handleDownloadReport = () => {

    const blob = new Blob([htmlContent], { type: "text/html" });
    const url = window.URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "Report.html");
    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

    setShowPopup(false);
  };

  const handleClosePopup = () => {
    setShowPopup(false);
  };

  return (
    <div  className="container">
      <div  className="form-container">
      <h1 style={{ marginBottom: "20px" }}>Generate Report</h1>
      <form
        onSubmit={handleSubmit}
        style={{ maxWidth: "400px", margin: "0 auto" }}
      >
        <div className="dropdown-container">
          <label
            htmlFor="dropdown"
            style={{ display: "block", marginBottom: "5px" }}
          >
            Report Type:
          </label>
          <select
            id="dropdown"
            value={reportType}
            onChange={(e) => setreportType(e.target.value)}
            style={{ width: "100%", padding: "10px" }}
            required
          >
            <option value="">Select a report type</option>
            <option value="Latency Report">Latency Report</option>
            <option value="Transaction Report" disabled>
              Transaction Report
            </option>
          </select>
        </div>
        <br/>
        <div className="dropdown-container">
          <label
            htmlFor="interval"
            style={{ display: "block", marginBottom: "5px" }}
          >
            Report Granularity:
          </label>
          <select
            id="interval"
            value={selectedInterval}
            onChange={(e) => setSelectedInterval(e.target.value)}
            style={{ width: "100%", padding: "10px" }}
            required
          >
            <option value="">Select an interval</option>
            <option value="MINUTE">MINUTE</option>
            <option value="HOUR">HOUR</option>
            <option value="DAY">DAY</option>
          </select>
        </div>
        <br/>
        <div className="dropdown-container">
          <label
            htmlFor="api"
            style={{ display: "block", marginBottom: "5px" }}
          >
            API Name:
          </label>
          <select
            id="api"
            value={selectedAPI}
            onChange={(e) => setSelectedAPI(e.target.value)}
          >
            <option value="">Select an option</option>
            {options.map((option) => (
              <option key={option.id || option.value} value={option.value}>
                {option.label || option.name}
              </option>
            ))}
          </select>
        </div>
        <br/>
        <div>
          <label style={{ display: "block", marginBottom: "5px" }}>
            Start Time:
          </label>
          <DatePicker
            selected={startTime}
            onChange={(date) => setStartTime(date)}
            showTimeSelect
            dateFormat="yyyy-MM-dd HH:mm"
            timeFormat="HH:mm"
            timeIntervals={15}
            timeCaption="Time"
            style={{ width: "100%", padding: "10px" }}
            required
          />
        </div>
        <br/>
        <div>
          <label style={{ display: "block", marginBottom: "5px" }}>
            End Time:
          </label>
          <DatePicker
            selected={endTime}
            onChange={(date) => setEndTime(date)}
            showTimeSelect
            dateFormat="yyyy-MM-dd HH:mm"
            timeFormat="HH:mm"
            timeIntervals={15}
            timeCaption="Time"
            style={{ width: "100%", padding: "10px" }}
            required
          />
        </div>
        <div class="button-container">
        <button
          type="submit"
          style={{
            width: "100%",
            padding: "10px",
            backgroundColor: "#007bff",
            color: "#fff",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Submit
        </button>
        </div>
        {error && <p style={{ color: "red" }}>{error}</p>}
      </form>
      {showPopup && (
        <div className="popup">
          <button className="close-button" onClick={handleClosePopup}>
            &times;
          </button>
          <br/><br/>
          <p>Report generated successfully!</p>
          <div class="button-container">
          <button onClick={handleDownloadReport}>Download Report</button>
          <br/>
          </div>
        </div>
      )}

      {showPopup && (
        <>
          <div className="overlay"></div>
          <div className="popup">
            <button className="close-button" onClick={handleClosePopup}>
              &times;
            </button>
            <br/><br/>
            <p>Report generated successfully!</p>
            <div class="button-container">
            <button onClick={handleDownloadReport}>Download Report</button>
            </div>
          </div>
        </>
      )}
      <div className={showPopup ? 'main-content disabled' : 'main-content'}>
      </div>
      </div>
    </div>
  );
};

export default ReportsPage;
