import React, { useState, useEffect, useMemo } from "react";
import { Line, Pie, Bar, Scatter } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, PointElement, Title, Tooltip, Legend } from 'chart.js';
import { db } from "./firebase";
import { collection, getDocs } from "firebase/firestore";
import { FaUserGraduate, FaCalculator, FaTable } from 'react-icons/fa';
import 'chart.js/auto';

ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, Title, Tooltip, Legend);

// Reusable chart options
const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
};

const Home = () => {
  const [natData, setNatData] = useState([]);
  const [sexDistribution, setSexDistribution] = useState({});
  const [studyHabitDistribution, setStudyHabitDistribution] = useState({});
  const [schoolTypeDistribution, setSchoolTypeDistribution] = useState({});
  const [natScoreDistribution, setNatScoreDistribution] = useState([]);
  const [averageNATScore, setAverageNATScore] = useState(0);
  const [averageAcademicPerformance, setAverageAcademicPerformance] = useState(0);
  const [totalStudents, setTotalStudents] = useState(0);
  const [topStudents, setTopStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  

  

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const natCollection = collection(db, "natData");
        const natSnapshot = await getDocs(natCollection);
        const dataList = natSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setNatData(dataList);
        calculateStats(dataList);
        calculateDistributions(dataList);
        getTopPerformingStudents(dataList);
        setLoading(false);
      } catch (error) {
        setError("Failed to fetch data.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);



  // Calculate average scores and total students
  const calculateStats = (dataList) => {
    const total = dataList.length;
    const natScores = dataList.map((item) => parseInt(item.NAT_Results, 10));
    const academicScores = dataList.map((item) => parseInt(item.Academic_perfromance, 10));

    const averageNATScore = natScores.reduce((a, b) => a + b, 0) / total;
    const averageAcademicPerformance = academicScores.reduce((a, b) => a + b, 0) / total;

    setAverageNATScore(averageNATScore);
    setAverageAcademicPerformance(averageAcademicPerformance);
    setTotalStudents(total);
  };

  // Calculate distributions for different categories using useMemo
  const calculateDistributions = (dataList) => {
    const sexDist = { Male: 0, Female: 0 };
    const studyHabitDist = { Excellent: 0, Good: 0, Poor: 0 };
    const schoolTypeDist = { Private: 0, Public: 0 };
    const natScores = [];

    dataList.forEach((data) => {
      // Sex Distribution
      sexDist[data.Sex] = sexDist[data.Sex] ? sexDist[data.Sex] + 1 : 1;

      // Study Habit Distribution
      studyHabitDist[data.Study_Habit] = studyHabitDist[data.Study_Habit] ? studyHabitDist[data.Study_Habit] + 1 : 1;

      // School Type Distribution
      schoolTypeDist[data.Type_school] = schoolTypeDist[data.Type_school] ? schoolTypeDist[data.Type_school] + 1 : 1;

      // NAT Score Distribution
      natScores.push(parseInt(data.NAT_Results, 10));
    });

    setSexDistribution(sexDist);
    setStudyHabitDistribution(studyHabitDist);
    setSchoolTypeDistribution(schoolTypeDist);
    setNatScoreDistribution(natScores);
  };

  // Get the top performing students based on NAT results
  const getTopPerformingStudents = (dataList) => {
    const sortedData = dataList.sort((a, b) => parseInt(b.NAT_Results) - parseInt(a.NAT_Results));
    const top10Students = sortedData.slice(0, 10);
    setTopStudents(top10Students);
  };

  // Chart Data for Distribution
  const sexChartData = useMemo(() => ({
    labels: ["Male", "Female"],
    datasets: [
      {
        data: [sexDistribution.Male || 0, sexDistribution.Female || 0],
        backgroundColor: ["#4e79a7", "#f28e2b"],
      },
    ],
  }), [sexDistribution]);
  

  const studyHabitChartData = {
    labels: ["Excellent", "Good", "Poor"],
    datasets: [
      {
        label: "Study Habit Distribution",
        data: [
          studyHabitDistribution.Excellent || 0,
          studyHabitDistribution.Good || 0,
          studyHabitDistribution.Poor || 0,
        ],
        backgroundColor: ["#a6cbe2", "#ffbc80", "#e0f7fa"],
        borderColor: ["#4e79a7", "#f28e2b", "#e0f7fa"],
        borderWidth: 1,
      },

      
    ],
    
  };

  

  const schoolTypeChartData = {
    labels: ["Private", "Public"],
    datasets: [
      {
        data: [schoolTypeDistribution.Private || 0, schoolTypeDistribution.Public || 0],
        backgroundColor: ["#a3c9f1", "#f7caca"],
      },
    ],
  };

  const natScoreChartData = {
    labels: natScoreDistribution,
    datasets: [
      {
        label: "NAT Scores",
        data: natScoreDistribution,
        fill: true,
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        borderColor: "rgba(75, 192, 192, 1)",
      },
    ],
  };

  const scatterChartData = {
    datasets: [
      {
        label: 'Academic Performance vs NAT Scores',
        data: natData.map(item => ({
          x: item.Academic_perfromance, 
          y: item.NAT_Results
        })),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1
      }
    ]
  };

  if (loading) return <p>Loading Home...</p>;
  if (error) return <p>{error}</p>;
  return (
    <div>
      <h2 className="text-3xl font-bold text-center mb-6 text-[#03346E] ">Dashboard</h2>

      {/* Data Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 ">
        <div className="bg-gradient-to-r from-[#0f213d] to-[#03346A] p-6 rounded-lg shadow-md flex flex-col items-center text-[#6EACDA]">
          <FaUserGraduate size={30} />
          <h3 className="text-xl font-semibold mt-4 text-[#6EACDA]">Total Students</h3>
          <p className="text-2xl text-[#6EACDA]">{totalStudents}</p>
        </div>

        <div className="bg-gradient-to-r from-[#0f213d] to-[#03346A] p-6 rounded-lg shadow-md flex flex-col items-center text-[#6EACDA]">
          <FaCalculator size={30} />
          <h3 className="text-xl font-semibold mt-4 text-[#6EACDA]">Average NAT Score</h3>
          <p className="text-2xl text-[#6EACDA]">{averageNATScore.toFixed(2)}</p>
        </div>

        <div className="bg-gradient-to-r from-[#0f213d] to-[#03346A] p-6 rounded-lg shadow-md flex flex-col items-center text-[#6EACDA]">
          <FaTable size={30} />
          <h3 className="text-xl font-semibold mt-4 text-[#6EACDA]">Average Academic Performance</h3>
          <p className="text-2xl text-[#6EACDA]">{averageAcademicPerformance.toFixed(2)}</p>
        </div>
      </div>

      {/* Distribution Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8 ">
        {/* Left Container: Pie Charts */}
        <div className="bg-gradient-to-r from-[#0f213d] to-[#03346A] p-6 rounded-lg shadow-md flex flex-col gap-8 text-[#6EACDA]">
          {/* Sex Distribution Pie Chart */}
          <div className="flex flex-col items-center">
            <h3 className="text-xl font-semibold mb-4">Sex Distribution</h3>
            <div className="w-full h-96">
              <Pie data={sexChartData} options={chartOptions} />
            </div>
          </div>

          {/* School Type Distribution Pie Chart */}
          <div className="flex flex-col items-center">
            <h3 className="text-xl font-semibold mb-4">School Type Distribution</h3>
            <div className="w-full h-96">
              <Pie data={schoolTypeChartData} options={chartOptions} />
            </div>
          </div>
        </div>

        {/* Right Container: Bar and Line Charts */}
        <div className="bg-gradient-to-r from-[#0f213d] to-[#03346A] p-6 rounded-lg shadow-md flex flex-col gap-8 text-[#6EACDA]">
          {/* Study Habit Bar Chart */}
          <div className="flex flex-col items-center">
            <h3 className="text-xl font-semibold mb-4">Study Habit Distribution</h3>
            <div className="w-full h-96">
              <Bar data={studyHabitChartData} options={chartOptions} />
            </div>
          </div>

          {/* NAT Score Line Chart */}
          <div className="flex flex-col items-center">
            <h3 className="text-xl font-semibold mb-4">NAT Score Distribution</h3>
            <div className="w-full h-96">
              <Line data={natScoreChartData} options={chartOptions} />
            </div>
          </div>
        </div>
      </div>

      {/* Scatter Plot */}
      <div className="bg-gradient-to-r from-[#0f213d] to-[#03346A] p-6 rounded-lg shadow-md mt-8 text-[#6EACDA]">
        <h3 className="text-xl font-semibold mb-4">Academic Performance vs NAT Scores</h3>
        <div className="w-full h-96">
          <Scatter data={scatterChartData} options={chartOptions} />
        </div>
      </div>

      {/* Top 10 Students Table */}
      <div className="bg-gradient-to-r from-[#0f213d] to-[#03346A] p-6 rounded-lg shadow-md mt-8 text-[#6EACDA]">
        <h3 className="text-xl font-semibold mb-4">Top Performing Students</h3>
        <table className="w-full table-auto">
          <thead>
            <tr>
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">NAT Score</th>
              <th className="px-4 py-2">Academic Performance</th>
              <th className="px-4 py-2">Academic Description</th>
              <th className="px-4 py-2">IQ</th>
              <th className="px-4 py-2">Type of School</th>
              <th className="px-4 py-2">Socio-Economic Status</th>
              <th className="px-4 py-2">Study Habit</th>
              <th className="px-4 py-2">NAT Results</th>
            </tr>
          </thead>
          <tbody>
            {topStudents.map((student) => (
              <tr key={student.id} className="hover:bg-gray-200">
                <td className="border px-4 py-2">{student.Respondents}</td>
                <td className="border px-4 py-2">{student.NAT_Results}</td>
                <td className="border px-4 py-2">{student.Academic_perfromance}</td>
                <td className="border px-4 py-2">{student.Academic_description}</td>
                <td className="border px-4 py-2">{student.IQ}</td>
                <td className="border px-4 py-2">{student.Type_school}</td>
                <td className="border px-4 py-2">{student.Socio_economic_status}</td>
                <td className="border px-4 py-2">{student.Study_Habit}</td>
                <td className="border px-4 py-2">{student.NAT_Results}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Home;
