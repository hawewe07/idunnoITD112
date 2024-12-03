import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import { FaHome, FaTable, FaInfoCircle, FaMoon, FaSun } from 'react-icons/fa';
import AddNatData from "./AddNatData";
import NATDataList from "./NATDataList";
import CsvUpload from "./CsvUpload";
import Insights from "./Insights";
import Home from "./Home";
import { db } from "./firebase";
import { collection, getDocs } from "firebase/firestore";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const [natData, setNatData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Fetch data from Firestore
  const fetchData = async () => {
    try {
      const natCollection = collection(db, "natData");
      const natSnapshot = await getDocs(natCollection);
      const dataList = natSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setNatData(dataList);
      setFilteredData(dataList);
    } catch (error) {
      console.error("Error fetching data: ", error);
      toast.error("Failed to fetch data from Firebase.");
    }
  };

  // Load the theme from localStorage and set it on app load
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      setIsDarkMode(savedTheme === "dark");
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, []); // Empty dependency array ensures fetchData runs only once on component mount

  const toggleDarkMode = () => {
    setIsDarkMode((prevMode) => {
      const newMode = !prevMode;
      localStorage.setItem("theme", newMode ? "dark" : "light");
      return newMode;
    });
  };

  return (
    <Router>
      <div className={`min-h-screen flex ${isDarkMode ? "bg-[#021526] text-[#E2E2B6]" : "bg-[#6EACDA] text-[#021526]"}`}>
        {/* Left-Side Fixed Navigation */}
        <nav className={`fixed top-0 left-0 w-64 h-full p-6 flex flex-col space-y-6 ${isDarkMode ? "bg-[#03346E] text-[#6EACDA]" : "bg-[#03346E] text-[#6EACDA]"}`}>
          <div className="text-2xl font-bold mb-8">NAT Data App</div>

          <Link to="/dashboard" className="flex items-center space-x-2 hover:text-[#E2E2B6] transition-all duration-300">
            <FaHome size={20} />
            <span>Home</span>
          </Link>

          <Link to="/data-management" className="flex items-center space-x-2 hover:text-[#E2E2B6] transition-all duration-300">
            <FaTable size={20} />
            <span>Data Management</span>
          </Link>

          <Link to="/insights" className="flex items-center space-x-2 hover:text-[#E2E2B6] transition-all duration-300">
            <FaInfoCircle size={20} />
            <span>Insights</span>
          </Link>

          <button 
            onClick={toggleDarkMode} 
            className={`mt-auto px-4 py-2 rounded ${isDarkMode ? "flex items-center space-x-2 bg-[#021526] text-[#6EACDA]" : "flex items-center space-x-2 bg-[#6EACDA] text-[#021526]"}`} 
            aria-label={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            {isDarkMode ? <FaSun size={20} /> : <FaMoon size={20} />}
            <span>{isDarkMode ? "Light Mode" : "Dark Mode"}</span>
          </button>
        </nav>

        {/* Main Content */}
        <div className="flex-1 p-8 ml-64">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/dashboard" element={<Home />} />
            <Route path="/data-management" element={<DataManagement fetchData={fetchData} filteredData={filteredData} isDarkMode={isDarkMode} />} />
            <Route path="/insights" element={<Insights natData={natData} isDarkMode={isDarkMode} />} />
            <Route path="*" element={<div>Page Not Found</div>} />
          </Routes>
        </div>
      </div>
      <ToastContainer />
    </Router>
  );
}

const DataManagement = ({ fetchData, filteredData, isDarkMode }) => (
  <div className={`p-8 rounded-lg shadow-md mt-8 ${isDarkMode ? "bg-[#03346E] text-[#6EACDA]" : "bg-[#03346E] text-[#6EACDA]"}`}>
    <h2 className="text-3xl font-bold text-center mb-6">Data Management</h2>

    {/* Add Data & Upload CSV */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <AddNatData isDarkMode={isDarkMode} />
      <CsvUpload onDataAdded={fetchData} isDarkMode={isDarkMode} />
    </div>

    {/* Data List */}
    <div className={`p-8 rounded-lg shadow-md mt-8 ${isDarkMode ? "bg-[#03346E] text-[#6EACDA]" : "bg-[#03346E] text-[#6EACDA]"}`}>
      <h3 className="text-xl font-semibold mb-6">Data List</h3>
      <NATDataList natData={filteredData} isDarkMode={isDarkMode} onDataUpdated={fetchData} onDataDeleted={fetchData} />
    </div>
  </div>
);

export default App;
