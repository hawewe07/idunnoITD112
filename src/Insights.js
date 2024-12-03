import React, { useEffect, useState } from "react";
import { db } from "./firebase";
import { collection, getDocs } from "firebase/firestore";
import { Bar, Scatter, Line } from "react-chartjs-2";
import 'chart.js/auto'; // For chartjs auto registration

const Insights = ({ isDarkMode }) => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedSex, setSelectedSex] = useState("All");
  const [selectedSchoolType, setSelectedSchoolType] = useState("All");
  const [selectedStudyHabit, setSelectedStudyHabit] = useState("All");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const natCollection = collection(db, "natData");
        const natSnapshot = await getDocs(natCollection);
        const dataList = natSnapshot.docs.map((doc) => doc.data());
        setData(dataList);
        setFilteredData(dataList); // Initially display all data
        setLoading(false);
      } catch (error) {
        setError("Failed to fetch data.");
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter data based on selected filters
  const filterData = () => {
    let filtered = [...data];

    if (selectedSex !== "All") {
      filtered = filtered.filter((item) => item.Sex === selectedSex);
    }

    if (selectedSchoolType !== "All") {
      filtered = filtered.filter((item) => item.Type_school === selectedSchoolType);
    }

    if (selectedStudyHabit !== "All") {
      filtered = filtered.filter((item) => item.Study_Habit === selectedStudyHabit);
    }

    setFilteredData(filtered);
  };

  // Recalculate average NAT scores after applying filters
  const calculateAverageNATScore = (category, filterValue) => {
    const filtered = filteredData.filter((item) => item[category] === filterValue);
    return filtered.reduce((sum, item) => sum + parseFloat(item.NAT_Results), 0) / filtered.length || 0;
  };

  // Handle filter changes
  const handleFilterChange = (e, filterType) => {
    if (filterType === "Sex") setSelectedSex(e.target.value);
    if (filterType === "SchoolType") setSelectedSchoolType(e.target.value);
    if (filterType === "StudyHabit") setSelectedStudyHabit(e.target.value);
  };

  // Update the filtered data whenever the filter changes
  useEffect(() => {
    filterData();
  }, [selectedSex, selectedSchoolType, selectedStudyHabit]);

  // Set grid line color based on theme
  const gridLineColor = isDarkMode ? "#6EACDA" : "#03346E";

  // Chart data for NAT Score by Sex
  const sexChartData = {
    labels: ["Male", "Female"],
    datasets: [{
      label: "Average NAT Score",
      data: [calculateAverageNATScore("Sex", "Male"), calculateAverageNATScore("Sex", "Female")],
      backgroundColor: ["#4e79a7", "#f28e2b"],
    }],
  };

  // Chart data for NAT Score by School Type
  const schoolTypeChartData = {
    labels: ["Private", "Public"],
    datasets: [{
      label: "Average NAT Score",
      data: [calculateAverageNATScore("Type_school", "Private"), calculateAverageNATScore("Type_school", "Public")],
      backgroundColor: ["#a3c9f1", "#f7caca"],
    }],
  };

  // Chart data for NAT Score by Study Habit
  const studyHabitChartData = {
    labels: ["Excellent", "Good", "Poor"],
    datasets: [{
      label: "Average NAT Score by Study Habit",
      data: [
        calculateAverageNATScore("Study_Habit", "Excellent"),
        calculateAverageNATScore("Study_Habit", "Good"),
        calculateAverageNATScore("Study_Habit", "Poor"),
      ],
      backgroundColor: ["#a6cbe2", "#ffbc80", "#e0f7fa"],
    }],
  };

  // Scatter plot for Academic Performance vs NAT Scores
  const scatterData = {
    datasets: [{
      label: 'Academic Performance vs NAT Scores',
      data: filteredData.map(item => ({
        x: item.Academic_perfromance, 
        y: item.NAT_Results
      })),
      backgroundColor: 'rgb(82, 82, 224)',
      borderColor: 'rgb(0, 0, 255)',
      borderWidth: 1,
    }],
  };

  // Line chart for NAT Score distribution
  const natScoreChartData = {
    labels: filteredData.map(item => item.Respondents),
    datasets: [{
      label: 'NAT Scores',
      data: filteredData.map(item => item.NAT_Results),
      fill: true,
      backgroundColor: "rgb(82, 82, 224)",
      borderColor: "rgb(0, 0, 255)",
    }],
  };

  // Chart options to modify grid line color
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        grid: {
          color: gridLineColor,
        },
      },
      y: {
        grid: {
          color: gridLineColor, 
        },
      },
    },
  };

  if (loading) return <p>Loading insights...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className={`p-6 rounded-lg shadow-md ${isDarkMode ? "bg-[#021526] text-[#6EACDA]" : "bg-[#6EACDA] text-[#021526]"}`}>
      <h2 className="text-2xl font-semibold text-[#03346E] mb-4">Deep Insights</h2>
      <p className="text-[#03346E] mb-6">
        Here are deeper insights into the data trends and analysis, including averages and comparisons across various categories.
      </p>

      {/* Filters */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold text-[#03346E] mb-4">Filter Data</h3>
        
        {/* Sex Filter */}
        <label className="mr-4 text-[#03346E]">Sex:</label>
        <select onChange={(e) => handleFilterChange(e, "Sex")} value={selectedSex} className="p-2 rounded">
          <option value="All">All</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
        </select>

        {/* School Type Filter */}
        <label className="ml-4 mr-4 text-[#03346E]">School Type:</label>
        <select onChange={(e) => handleFilterChange(e, "SchoolType")} value={selectedSchoolType} className="p-2 rounded">
          <option value="All">All</option>
          <option value="Private">Private</option>
          <option value="Public">Public</option>
        </select>

        {/* Study Habit Filter */}
        <label className="ml-4 mr-4 text-[#03346E]">Study Habit:</label>
        <select onChange={(e) => handleFilterChange(e, "StudyHabit")} value={selectedStudyHabit} className="p-2 rounded">
          <option value="All">All</option>
          <option value="Excellent">Excellent</option>
          <option value="Good">Good</option>
          <option value="Poor">Poor</option>
        </select>
      </div>

      {/* Insights for Average NAT Scores by Sex */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold text-[#03346E]">Average NAT Scores by Sex</h3>
        <p className="text-[#03346E] mb-4">
          This chart compares the average NAT scores between male and female students. Understanding how gender may impact performance can guide targeted interventions and support.
        </p>
        <div className="w-full h-96 mt-4">
          <Bar data={sexChartData} options={chartOptions} />
        </div>
      </div>

      {/* Insights for Average NAT Scores by School Type */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold text-[#03346E]">Average NAT Scores by School Type</h3>
        <p className="text-[#03346E] mb-4">
          This analysis compares the average NAT scores of students from private and public schools. It can provide insights into how different educational environments affect student performance.
        </p>
        <div className="w-full h-96 mt-4">
          <Bar data={schoolTypeChartData} options={chartOptions} />
        </div>
      </div>

      {/* Insights for Average NAT Scores by Study Habit */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold text-[#03346E]">Average NAT Scores by Study Habit</h3>
        <p className="text-[#03346E] mb-4">
          This chart shows how different study habits (Excellent, Good, Poor) impact students' NAT scores. It highlights the importance of effective study practices on academic success.
        </p>
        <div className="w-full h-96 mt-4">
          <Bar data={studyHabitChartData} options={chartOptions} />
        </div>
      </div>

      {/* Scatter Plot for Academic Performance vs NAT Scores */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold text-[#03346E]">Academic Performance vs NAT Scores</h3>
        <p className="text-[#03346E] mb-4">
          This scatter plot visualizes the relationship between academic performance and NAT scores. It can help identify any correlation between students' ongoing academic performance and their final test results.
        </p>
        <div className="w-full h-96 mt-4">
          <Scatter data={scatterData} options={chartOptions} />
        </div>
      </div>

      {/* NAT Score Distribution Line Chart */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold text-[#03346E]">NAT Score Distribution</h3>
        <p className="text-[#03346E] mb-4">
          This line chart shows the distribution of NAT scores across all respondents. It provides an overview of how the scores are spread and if there are any patterns of concentration.
        </p>
        <div className="w-full h-96 mt-4">
          <Line data={natScoreChartData} options={chartOptions} />
        </div>
      </div>
    </div>
  );
};

export default Insights;
