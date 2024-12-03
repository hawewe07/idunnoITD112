import React, { useState, useMemo } from "react";
import { db } from "./firebase";
import { doc, deleteDoc, updateDoc } from "firebase/firestore";
import { toast } from "react-toastify";

const NATDataList = ({ natData, onDataUpdated, onDataDeleted, isDarkMode }) => {
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({
    Respondents: "",
    Age: "",
    Sex: "",
    Ethnic: "",
    Academic_perfromance: "",
    Academic_description: "",
    IQ: "",
    Type_school: "",
    Socio_economic_status: "",
    Study_Habit: "",
    NAT_Results: "",
  });

  const [searchTerm, setSearchTerm] = useState("");

  // Handle Delete
  const handleDelete = async (id) => {
    const natDocRef = doc(db, "natData", id);
    try {
      await deleteDoc(natDocRef);
      onDataDeleted(id);
      toast.success("Data deleted successfully!");
    } catch (error) {
      console.error("Error deleting document: ", error);
      toast.error("Error deleting data: " + error.message);
    }
  };

  // Handle Edit
  const handleEdit = (data) => {
    setEditingId(data.id);
    setEditForm({
      Respondents: data.Respondents,
      Age: data.Age,
      Sex: data.Sex,
      Ethnic: data.Ethnic,
      Academic_perfromance: data.Academic_perfromance,
      Academic_description: data.Academic_description,
      IQ: data.IQ,
      Type_school: data.Type_school,
      Socio_economic_status: data.Socio_economic_status,
      Study_Habit: data.Study_Habit,
      NAT_Results: data.NAT_Results,
    });
  };

  // Handle Update
  const handleUpdate = async (e) => {
    e.preventDefault();

    // Parse numeric fields (Age, Academic Performance, and NAT Results)
    const Age = parseFloat(editForm.Age);
    const AcademicPerformance = parseFloat(editForm.Academic_perfromance);
    const NatResults = parseFloat(editForm.NAT_Results);

    // Check if Age, Academic Performance, and NAT Results are valid numbers
    if (isNaN(Age) || isNaN(AcademicPerformance) || isNaN(NatResults)) {
      toast.error("Age, Academic Performance, and NAT Results must be numbers.");
      return;
    }

    // IQ can be a string, no need to parse it
    const updatedData = { ...editForm, Age: Age, Academic_perfromance: AcademicPerformance, NAT_Results: NatResults };

    const natDocRef = doc(db, "natData", editingId);
    try {
      await updateDoc(natDocRef, updatedData);
      const updatedDataWithId = { id: editingId, ...updatedData };
      onDataUpdated(updatedDataWithId);
      setEditingId(null);
      toast.success("Data updated successfully!");
    } catch (error) {
      console.error("Error updating document: ", error);
      toast.error("Error updating data: " + error.message);
    }
  };

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Filter the data based on the search term using useMemo for optimization
  const filteredData = useMemo(() => {
    return natData.filter((data) =>
      data.Respondents?.toLowerCase().includes(searchTerm.toLowerCase()) // Added null check
    );
  }, [natData, searchTerm]);

  return (
    <div
      className={`p-6 rounded-lg shadow-md ${
        isDarkMode
          ? "bg-[#021526] text-[#6EACDA] border border-[#6EACDA]"
          : "bg-[#6EACDA] text-[#021526] border border-[#FFFFFF]"
      }`}
    >
      {/* Search Bar */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search by Respondent"
          value={searchTerm}
          onChange={handleSearchChange}
          className={`w-full p-2 rounded border ${
            isDarkMode
              ? "bg-[#021526] text-[#6EACDA] border-[#6EACDA]"
              : "bg-[#6EACDA] text-[#021526]  border-[#03346E]"
          }`}
        />
      </div>

      {editingId ? (
        <form onSubmit={handleUpdate} className="space-y-4">
          {Object.keys(editForm).map((key) => (
            <div key={key}>
              <label className="block mb-1" style={{ color: "#03346E" }}>
                {key.replace(/_/g, " ")}
              </label>
              <input
                type={key === "Age" || key === "Academic_perfromance" || key === "NAT_Results" ? "number" : "text"}
                name={key}
                value={editForm[key]}
                onChange={(e) =>
                  setEditForm({ ...editForm, [key]: e.target.value })
                }
                className={`w-full p-2 rounded border ${
                  isDarkMode
                    ? "bg-[#021526] text-[#6EACDA] border-[#6EACDA]"
                    : "bg-[#6EACDA] text-[#021526] border-[#03346E]"
                }`}
                required
              />
            </div>
          ))}
          <button
            type="submit"
            className={`w-full p-2 rounded ${
              isDarkMode
                ? "bg-[#03346E] text-[#6EACDA] hover:opacity-90"
                : "bg-[#03346E] text-[#6EACDA] hover:opacity-90"
            }`}
          >
            Update Data
          </button>
          <button
            type="button"
            onClick={() => setEditingId(null)}
            className="w-full mt-2 p-2 rounded bg-red-500 text-white hover:bg-red-600"
          >
            Cancel
          </button>
        </form>
      ) : (
        <div className="overflow-x-auto">
          <table
            className={`w-full mt-4 border ${isDarkMode ? "border-[#6EACDA]" : "border-[#03346E]"}`}
          >
            <thead>
              <tr
                className={`${isDarkMode ? "bg-[#03346E]" : "bg-[#03346E]"} text-[#6EACDA] border ${
                  isDarkMode ? "border-[#6EACDA]" : "border-[#03346E]"
                }`}
              >
                <th className="px-4 py-2 text-center">Respondents</th>
                <th className="px-4 py-2 text-center">Age</th>
                <th className="px-4 py-2 text-center">Sex</th>
                <th className="px-4 py-2 text-center">Ethnic</th>
                <th className="px-4 py-2 text-center">Academic Performance</th>
                <th className="px-4 py-2 text-center">Academic Description</th>
                <th className="px-4 py-2 text-center">IQ</th>
                <th className="px-4 py-2 text-center">Type of School</th>
                <th className="px-4 py-2 text-center">Socio-Economic Status</th>
                <th className="px-4 py-2 text-center">Study Habit</th>
                <th className="px-4 py-2 text-center">NAT Results</th>
                <th className="px-4 py-2 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.length === 0 ? (
                <tr>
                  <td colSpan="12" className="text-center py-4">No data found</td>
                </tr>
              ) : (
                filteredData.map((data) => (
                  <tr key={data.id}>
                    <td className="px-4 py-2 text-center">{data.Respondents}</td>
                    <td className="px-4 py-2 text-center">{data.Age}</td>
                    <td className="px-4 py-2 text-center">{data.Sex}</td>
                    <td className="px-4 py-2 text-center">{data.Ethnic}</td>
                    <td className="px-4 py-2 text-center">{data.Academic_perfromance}</td>
                    <td className="px-4 py-2 text-center">{data.Academic_description}</td>
                    <td className="px-4 py-2 text-center">{data.IQ}</td>
                    <td className="px-4 py-2 text-center">{data.Type_school}</td>
                    <td className="px-4 py-2 text-center">{data.Socio_economic_status}</td>
                    <td className="px-4 py-2 text-center">{data.Study_Habit}</td>
                    <td className="px-4 py-2 text-center">{data.NAT_Results}</td>
                    <td className="px-4 py-2 flex space-x-2 justify-center">
                      <button
                        onClick={() => handleEdit(data)}
                        className="bg-blue-500 text-white px-3 py-1 rounded hover:opacity-90"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(data.id)}
                        className="bg-red-500 text-white px-3 py-1 rounded hover:opacity-90"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default NATDataList;
