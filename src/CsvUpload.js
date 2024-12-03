import React, { useState } from "react";
import Papa from "papaparse";
import { db } from "./firebase";
import { collection, addDoc } from "firebase/firestore";
import { toast } from "react-toastify";

const CsvUpload = ({ onDataAdded, isDarkMode }) => {
  const [csvData, setCsvData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [fileName, setFileName] = useState(""); // State to store the uploaded file name

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file || file.type !== "text/csv") {
      setError("Please upload a valid CSV file.");
      setCsvData([]);
      setFileName(""); // Clear file name if invalid file is uploaded
      return;
    }

    setFileName(file.name); // Store the file name in the state

    Papa.parse(file, {
      complete: (result) => {
        if (!result.data || result.data.length === 0) {
          setError("CSV is empty or has no valid data.");
          setFileName(""); // Clear file name if the CSV is empty or invalid
          return;
        }
        setCsvData(result.data);
        setError(null);
      },
      header: true,
      skipEmptyLines: true,
    });
  };

  const saveToDatabase = async () => {
    setLoading(true);
    setError(null);

    try {
      for (const row of csvData) {
        if (!row.Respondents || !row.Age || isNaN(row.NAT_Results)) {
          console.warn("Skipping row due to missing or invalid data:", row);
          continue;
        }
        await addDoc(collection(db, "natData"), row);
      }
      setLoading(false);
      setCsvData([]);  // Reset after successful upload
      setFileName("");  // Clear the file name after saving
      onDataAdded();
      toast.success("CSV data uploaded successfully!");
    } catch (error) {
      setLoading(false);
      setError("Error saving data.");
      toast.error(error.message);
    }
  };

  // Define class names based on dark mode
  const inputClasses = isDarkMode
    ? "bg-[#021526] text-[#6EACDA] border-[#6EACDA]"
    : "bg-[#6EACDA] text-[#021526] border-[#03346E]";

  const buttonClasses = loading
    ? "bg-gray-400 text-gray-800"
    : isDarkMode
    ? "bg-[#03346E] text-[#6EACDA] hover:opacity-90"
    : "bg-[#03346E] text-[#6EACDA] hover:opacity-90";

  return (
    <div
      className={`p-6 rounded-lg shadow-md ${
        isDarkMode
          ? "bg-[#021526] text-[#6EACDA] border border-[#6EACDA]"
          : "bg-[#6EACDA] text-[#021526] border border-[#FFFFFF]"
      }`}
    >
      <h3 className="text-xl font-semibold mb-4">Upload CSV</h3>
      
      {/* File Upload Input */}
      <input
        type="file"
        accept=".csv"
        onChange={handleFileUpload}
        className={`w-full mb-4 p-2 border rounded ${inputClasses}`}
      />
      
      {/* Display the file name if a file is selected */}
      {fileName && (
        <div className="mb-4 text-sm text-gray-700">
          <strong>Selected File: </strong> {fileName}
        </div>
      )}
      
      {/* Save Button */}
      <button
        onClick={saveToDatabase}
        disabled={loading}
        className={`w-full p-2 rounded ${buttonClasses}`}
      >
        {loading ? "Saving..." : "Save Data"}
      </button>
      {error && <p className="mt-2 text-red-500 border border-red-500 p-2 rounded">{error}</p>}
    </div>
  );
};

export default CsvUpload;
