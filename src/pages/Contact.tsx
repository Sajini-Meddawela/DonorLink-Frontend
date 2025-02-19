import React, { useState } from 'react';
import Navbar from '../Layout/NavBar';
import { Mail, Phone, MapPin, Facebook, Instagram, HelpCircle } from 'lucide-react';

interface FormData {
  name: string;
  email: string;
  phone: string;
  message: string;
}

const Contact: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    message: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    
    try {
      const response = await fetch('YOUR_EMAIL_API_ENDPOINT', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: 'donorlink@gmail.com',
          subject: 'New Contact Form Submission',
          ...formData
        }),
      });

      if (response.ok) {
        alert('Message sent successfully!');
        setFormData({ name: '', email: '', phone: '', message: '' });
      }
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Failed to send message. Please try again.');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen bg-sky-300">
      <Navbar />
      
      <div className="pt-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-12">
          {/* Contact Form */}
          <div className="bg-sky-200/50 p-8 rounded-lg shadow-lg">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-white text-lg mb-2">
                  Name:
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full p-3 rounded-lg"
                  placeholder="Full Name"
                  required
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-white text-lg mb-2">
                  Email:
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full p-3 rounded-lg"
                  placeholder="Email"
                  required
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-white text-lg mb-2">
                  Phone Number:
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full p-3 rounded-lg"
                  placeholder="Phone Number"
                  required
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-white text-lg mb-2">
                  Message:
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full p-3 rounded-lg"
                  rows={4}
                  placeholder="Message"
                  required
                />
              </div>

              <div className="flex justify-center">
                <button
                  type="submit"
                  className="bg-[#85C536] hover:bg-[#85C536] text-white px-8 py-3 rounded-full text-lg font-medium transition-colors duration-200"
                >
                  Send
                </button>
              </div>
            </form>
          </div>

          {/* Contact Information */}
          <div className="text-white space-y-8">
            <div>
              <h2 className="text-3xl font-bold mb-6">
                Have questions or need assistance? We're here to help!
              </h2>
              
              {/* Social Links */}
              <div className="bg-white p-4 rounded-lg flex justify-around items-center">
                <a href="#" className="text-[#85C536] hover:text-[#85C536]">
                  <Facebook size={24} />
                </a>
                <a href="#" className="text-[#85C536] hover:text-[#85C536]">
                  <Instagram size={24} />
                </a>
                <a href="mailto:donorlink@gmail.com" className="text-[#85C536] hover:text-[#85C536]">
                  <Mail size={24} />
                </a>
                <a href="tel:+1234567890" className="text-[#85C536] hover:text-[#85C536]">
                  <Phone size={24} />
                </a>
                <a href="#" className="text-[#85C536] hover:text-[#85C536]">
                  <MapPin size={24} />
                </a>
              </div>
            </div>

            {/* FAQ Section */}
            <div className="mt-12 flex items-center justify-end space-x-4">
              <span className="text-2xl font-bold">FAQ</span>
              <HelpCircle size={32} className="text-white" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
