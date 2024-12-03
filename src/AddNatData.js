import React, { useState } from "react";
import { db } from "./firebase";
import { collection, addDoc } from "firebase/firestore";
import { toast } from "react-toastify";

const AddNatData = ({ isDarkMode }) => {
  const [data, setData] = useState({
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

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData({
      ...data,
      [name]: value,
    });
  };

  const validateForm = () => {
    if (isNaN(data.Age) || isNaN(data.Academic_perfromance) || isNaN(data.NAT_Results)) {
      toast.error("Age, Academic Performance, and NAT Results must be numbers.");
      return false;
    }
    if (!data.Respondents || !data.Sex || !data.Ethnic || !data.Academic_perfromance) {
      toast.error("All fields must be filled.");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      await addDoc(collection(db, "natData"), data);
      toast.success("Data added successfully!");
      setData({
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
    } catch (error) {
      toast.error("Error adding data: " + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputStyles = isDarkMode
    ? "bg-[#021526] text-[#E2E2B6] border-[#6EACDA]"
    : "bg-[#6EACDA] text-[#021526] border-[#03346E]";

  const buttonStyles = isDarkMode
    ? "bg-[#03346E] text-[#6EACDA] hover:opacity-90"
    : "bg-[#03346E] text-[#6EACDA] hover:opacity-90";

  return (
    <form
      onSubmit={handleSubmit}
      className={`p-6 space-y-6 rounded-lg shadow-md ${
        isDarkMode ? "bg-[#021526] text-[#6EACDA] border border-[#6EACDA]" : "bg-[#6EACDA] text-[#021526] border border-[#FFFFFF]"
      }`}
    >
      <h2 className="text-2xl font-bold mb-4">Add New Data</h2>
      {Object.keys(data).map((key) => (
        <div key={key}>
          <label className="block mb-2 text-sm">{key.replace(/_/g, " ")}</label>
          <input
            type={key === "Age" || key === "Academic_performance" || key === "NAT_Results" ? "number" : "text"}
            name={key}
            value={data[key]}
            onChange={handleChange}
            className={`w-full p-2 border rounded ${inputStyles}`}
            required
            placeholder={`Enter ${key.replace(/_/g, " ")}`}
          />
        </div>
      ))}
      <button
        type="submit"
        className={`w-full p-2 rounded ${buttonStyles}`}
        disabled={isSubmitting}
      >
        {isSubmitting ? "Adding..." : "Add Data"}
      </button>
    </form>
  );
};

export default AddNatData;
