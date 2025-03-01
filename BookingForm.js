import React, { useState } from "react";
import { MdClose } from "react-icons/md";
import axios from "axios";


const BookingForm = ({ onClose }) => {
  const [formData, setFormData] = useState({
    name: "",
    date: "",
    time: "",
    service: "",
    contact: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    // e.preventDefault();
    // console.log("Booking Details:", formData);
    // alert("Your appointment has been booked!");
    // onClose(); // Close modal after submission
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const response = await axios.post("http://localhost:3000/api/book-appointment", formData);
      alert("Appointment booked successfully!");
      console.log(response.data);
      onClose();
    } catch (error) {
      alert("Failed to book appointment. Try again.");
      console.error(error);
    }
    setIsSubmitting(false);
  };


  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="w-full max-w-screen-sm md:max-w-md lg:max-w-lg bg-white p-6 rounded-lg shadow-lg relative">
      <button
        className="absolute top-4 right-4 text-gray-600 hover:text-gray-900"
        onClick={onClose}  // ✅ Make sure this correctly calls the function
      >
        <MdClose size={24} />
      </button>
        <h2 className="text-2xl font-bold text-center text-orange-600 mb-4">Book an Appointment</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Your Name"
            value={formData.name}
            onChange={handleChange}
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
            required
          />
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
            required
          />
          <input
            type="time"
            name="time"
            value={formData.time}
            onChange={handleChange}
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
            required
          />
          <select
            name="service"
            value={formData.service}
            onChange={handleChange}
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
            required
          >
            <option value="">Select a Service</option>
            <option value="Haircut">Haircut</option>
            <option value="Hair Coloring">Hair Coloring</option>
            <option value="Styling">Styling</option>
            <option value="Facial">Facial</option>
          </select>
          <input
            type="text"
            name="contact"
            placeholder="Your Contact Number"
            value={formData.contact}
            onChange={handleChange}
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
            required
          />
          {/* <button
          type="submit"
          className="w-full bg-orange-500 text-white py-2 rounded-md hover:bg-orange-600 transition duration-200"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Booking..." : "Confirm Booking"}
        </button> */}
          <button
            type="submit"
            className="w-full item-bottom bg-orange-500 text-white py-2 rounded-md hover:bg-orange-600 transition duration-200"
          >
            Confirm Booking
          </button>
          
        </form>
      </div>
    </div>
  );
};

export default BookingForm;
