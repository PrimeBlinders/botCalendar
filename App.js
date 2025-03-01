import logo from './logo.svg';
import React, { useState } from "react";
import axios from "axios";
import { FaFacebook, FaInstagram, FaTwitter, FaPaperPlane } from "react-icons/fa";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import './App.css';
import "tailwindcss/tailwind.css";
import "react-chatbot-kit/build/main.css";
import BookingForm from "./BookingForm";


const Home = () => (
  <div className="text-center p-10 bg-gray-800 text-white min-h-screen flex flex-col justify-center bg-cover bg-fixed">
    <h1 className="text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600 drop-shadow-md">Welcome to Luxe AI Salon</h1>
    <h2 className="mt-6 text-gray-300 text-lg max-w-xl text-center">Experience cutting-edge styling, beauty care, and AI-powered assistance for all your beauty needs.</h2>
    <Link to="/services" className="mt-6 inline-block px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full shadow-lg hover:scale-105 transform transition">View Services</Link>
  </div>
);


const Services = () => (
  <div className="p-10 bg-gray-800 text-white min-h-screen flex flex-col items-center">
    <h2 className="text-4xl font-bold text-gray-100">Our Services</h2>
    <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
      {[
        { name: "💇‍♀️ Haircut & Styling", desc: "Trendy haircuts & expert styling." },
        { name: "💅 Manicure & Pedicure", desc: "Luxurious nail care treatments." },
        { name: "💆‍♂️ Spa & Relaxation", desc: "Rejuvenating spa therapies." }
      ].map((service, index) => (
        <div key={index} className="bg-gray-700 px-6 py-4 rounded-lg shadow-md hover:scale-105 transition transform">
          <h3 className="text-xl font-bold">{service.name}</h3>
          <p className="text-gray-300 mt-2">{service.desc}</p>
        </div>
      ))}
    </div>
  </div>
);

const ChatBot = () => {
  const [messages, setMessages] = useState([
    { text: "Welcome! How can I assist you today?", sender: "bot" }
  ]);  
  const [input, setInput] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const suggestedMessages = ["Book an appointment", "Our services", "Pricing details"];
  const [showBookingForm, setShowBookingForm] = useState(false);


  const handleSendMessage = async (message = input) => {
    if (message.trim()) {
      const userMessage = { text: message, sender: "user" };
      setMessages((prev) => [...prev, userMessage]);
      setInput("");
      setShowSuggestions(false);
      if (message.toLowerCase().includes("book")) {
        setShowBookingForm(true);
        return;
      }
      const apiKey = 'EQmkMjuR3scqxHvsgS9P4UmrUjcZ6INJY4hEkygN'; // Replace with your Cohere API key
      const endpoint = 'https://api.cohere.ai/v1/generate';
      try {

        const response = await axios.post(
          endpoint,
          {
            prompt: `Assistant AI: ${message}`,
            max_tokens: 50,
            temperature: 0.7,
          },
          {
            headers: {
              Authorization: `Bearer ${apiKey}`,
              'Content-Type': 'application/json',
            },
          }
        );
  
        const data = await response.data;
        const botMessage = { text: data.generations[0].text, sender: "bot" };
        setMessages((prev) => [...prev, botMessage]);
      } catch (error) {
        console.error("Error fetching response:", error);
      }
    }
  };

  return (
    <div className="fixed bottom-10 right-6 ">
      <button 
        className="bg-blue-600 w-40 h-[60px] text-white px-4 py-2 rounded-full shadow-lg hover:bg-blue-700 transition flex align-center items-center gap-2" 
        onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? "✖ Close Chat" : "💬 Chat With Us"}
      </button>
      {isOpen && (
        <div className="mt-2 bg-white/90 backdrop-blur-lg p-4 rounded-xl shadow-xl w-80 h-[550px] border border-gray-300 flex flex-col">
          <div className="bg-orange-500 text-white p-2 rounded-t-lg flex items-center justify-between">
            <h3 className="text-lg font-semibold">💬 AI Chatbot</h3>
            <button className="text-white text-xl" onClick={() => setIsOpen(false)}>✖</button>
          </div>
          <div className="flex-1 overflow-y-auto p-2">
            {messages.map((msg, index) => (
              <div key={index} className={msg.sender === "user" ? "text-right" : "text-left"}>
                <p className={`inline-block p-2 rounded-lg ${msg.sender === "user" ? "bg-blue-500 text-white" : "bg-gray-200 text-black flex items-center gap-2"} mt-2 max-w-xs`}>
                  {msg.sender === "bot" && <span>⭐</span>} {msg.text}
                </p>
              </div>
            ))}
          </div>
          {showSuggestions && (
           <div className="mt-2 flex flex-wrap gap-2">
           {suggestedMessages.map((msg, index) => (
             <button key={index} 
             className="bg-gray-300 text-black px-3 py-1 rounded-md" 
             onClick={() => handleSendMessage(msg)}>
               {msg}
             </button>
           ))}
         </div>
          )
          }
         
         <div className="mt-auto flex items-center border-t pt-2">
         <input 
              type="text" 
              className="flex-grow border p-2 rounded-l-lg bg-white text-black" 
              value={input} 
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSendMessage(input)}
              placeholder="Write a message..."
            />
            <button 
      className="bg-orange-500 text-white px-4 py-2 rounded-r-lg"
      onClick={() => handleSendMessage()}
            ><FaPaperPlane />
            </button>
          </div>
          {showBookingForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg relative w-1/3">
          <BookingForm onClose={() => setShowBookingForm(false)} />
          </div>
        </div>
      )}
        </div>
      )}
    </div>
  );
};

const Footer = () => (
  <footer className="bg-gray-900 text-white text-center p-6 mt-10">
    <p className="text-gray-400">&copy; 2025 Luxe AI Salon. All rights reserved.</p>
    <div className="flex justify-center gap-4 mt-3 text-xl">
      <FaFacebook className="hover:text-blue-500 cursor-pointer" />
      <FaInstagram className="hover:text-pink-500 cursor-pointer" />
      <FaTwitter className="hover:text-blue-400 cursor-pointer" />
    </div>
  </footer>
);

function App() {

  const [showBookingForm, setShowBookingForm] = useState(false); // State for booking form
  const [background, setBackground] = useState("/images/salon-bg.jpg"); // Default background

  return (

    <div className="App">
      
      <Router>
      <div className="min-h-screen flex flex-col justify-between bg-gray-900">
      {/* Background Section */}
      <div 
      className="absolute inset-0 bg-cover bg-center opacity-30" 
      style={{ backgroundImage: `url(${background})`, backgroundSize: "cover", backgroundPosition: "center" }}

      // style={{ backgroundImage: "url('/images/salon-bg.jpg')" }}
      >
      </div>
      {/* Navigation Bar */}
      <nav className="p-4 bg-gradient-to-r from-gray-800 to-black text-white flex justify-between shadow-lg relative z-10">
        <Link 
          to="/" 
          className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-600"
          onClick={() => setBackground("/images/salon-bg.jpg")} // Home background

        >
          Luxe AI Salon
        </Link>
        <div className="space-x-6 text-lg">
          <Link to="/" className="hover:text-pink-400 transition" onClick={() => setBackground("/images/salon-bg.jpg")}>Home</Link>
          <Link to="/services" className="hover:text-purple-400 transition" onClick={() => setBackground("/images/services-bg.jpg")}>Services</Link>
 {/* ✅ Open booking form when clicking "Book Now" */}
          <button onClick={() => setShowBookingForm(true)} className="hover:text-pink-400 transition">
            Book Now
          </button>        
        </div>
      </nav>
      {/* Routes */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/services" onClick={() => setBackground("/images/services-bg.jpg")} element={<Services />} />
        <Route path="/bookings" element={<BookingForm />} />
      </Routes>
      {showBookingForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <BookingForm onClose={() => setShowBookingForm(false)} />
        </div>
      )}
      {/* Chatbot and Footer */}
      <ChatBot setShowBookingForm={setShowBookingForm} />
      <Footer />
        </div>
      </Router>
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
