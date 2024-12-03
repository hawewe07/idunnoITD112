import React, { useState } from "react";
import Papa from "papaparse";
import { db } from "./firebase";
import { collection, addDoc } from "firebase/firestore";
import { toast } from "react-toastify";

const CsvUpload = ({ onDataAdded, isDarkMode }) => {
  const [csvData, setCsvData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file || file.type !== "text/csv") {
      setError("Please upload a valid CSV file.");
      setCsvData([]);
      return;
    }

    Papa.parse(file, {
      complete: (result) => {
        if (!result.data || result.data.length === 0) {
          setError("CSV is empty or has no valid data.");
          return;
        }
        setCsvData(result.data);
        setError(null);
        e.target.value = ''; // Reset the input field after successful parse
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
      onDataAdded();
      toast.success("CSV data uploaded successfully!");
    } catch (error) {
      setLoading(false);
      setError("Error saving data.");
      toast.error(error.message);
    }
  };

  return (
    <div
      className={`p-6 rounded-lg shadow-md ${
        isDarkMode
          ? "bg-[#021526] text-[#6EACDA] border border-[#6EACDA]"
          : "bg-[#6EACDA] text-[#021526] border border-[#FFFFFF]"
      }`}
    >
      <h3 className="text-xl font-semibold mb-4">Upload CSV</h3>
      <input
        type="file"
        accept=".csv"
        onChange={handleFileUpload}
        className={`w-full mb-4 p-2 border rounded ${
          isDarkMode
            ? "bg-[#021526] text-[#6EACDA] border-[#6EACDA]"
            : "bg-[#6EACDA] text-[#021526] border-[#03346E]"
        }`}
      />
      <button
        onClick={saveToDatabase}
        disabled={loading}
        className={`w-full p-2 rounded ${
          loading
            ? "bg-gray-400 text-gray-800"
            : isDarkMode
            ? "bg-[#03346E] text-[#6EACDA] hover:opacity-90"
            : "bg-[#03346E] text-[#6EACDA] hover:opacity-90"
        }`}
      >
        {loading ? "Saving..." : "Save Data"}
      </button>
      {error && <p className="mt-2 text-red-500 border border-red-500 p-2 rounded">{error}</p>}
    </div>
  );
};

export default CsvUpload;
