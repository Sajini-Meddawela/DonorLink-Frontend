import React, { useState, useEffect } from 'react';
import Navbar from '../Layout/NavBar';
import Footer from '../components/Footer'; 

interface StatisticsType {
  careHomes: number;
  donors: number;
  categories: number;
}

const About: React.FC = () => {
  const [stats, setStats] = useState<StatisticsType>({
    careHomes: 0,
    donors: 0,
    categories: 0,
  });

  // Simulate fetching data from database
  useEffect(() => {
    const fetchStats = async () => {
      const data = {
        careHomes: 12,
        donors: 40,
        categories: 25,
      };
      setStats(data);
    };

    fetchStats();
  }, []);

  return (
    <>
      <Navbar /> 
      <div className="bg-sky-300 min-h-screen pt-16">
        <div className="mx-auto px-[189px]">
          <div className="py-16 text-center text-white">
            {/* Mission Section */}
            <section className="mb-16">
              <h2 className="text-4xl font-bold mb-6">Mission</h2>
              <p className="text-lg leading-relaxed">
                Welcome to DonorLink, a platform dedicated to making donations smarter and more impactful. 
                We help care homes get the right donations while allowing donors to give with confidence.
              </p>
            </section>

            {/* Our Story Section */}
            <section className="mb-16">
              <h2 className="text-4xl font-bold mb-6">Our Story</h2>
              <p className="text-lg leading-relaxed">
                Born out of the need to reduce wastage and increase efficiency in donations, 
                DonorLink was created to help both care homes and donors make a difference with 
                ease and transparency.
              </p>
            </section>

            {/* Statistics Section */}
            <section className="grid grid-cols-3 gap-8 mt-12">
              {/* Children and Elder care homes */}
              <div className="flex flex-col items-center">
                <div className="bg-[#85C536] rounded-full w-24 h-24 flex items-center justify-center mb-4">
                  <span className="text-3xl font-bold text-white">{stats.careHomes}</span>
                </div>
                <p className="text-white text-lg font-medium text-center">
                  Children and<br />Elder care homes
                </p>
              </div>

              {/* Worldwide Donors */}
              <div className="flex flex-col items-center">
                <div className="bg-[#85C536] rounded-full w-24 h-24 flex items-center justify-center mb-4">
                  <span className="text-3xl font-bold text-white">{stats.donors}</span>
                </div>
                <p className="text-white text-lg font-medium text-center">
                  Worldwide<br />Donors
                </p>
              </div>

              {/* Various Categories */}
              <div className="flex flex-col items-center">
                <div className="bg-[#85C536] rounded-full w-24 h-24 flex items-center justify-center mb-4">
                  <span className="text-3xl font-bold text-white">{stats.categories}</span>
                </div>
                <p className="text-white text-lg font-medium text-center">
                  Various<br />Categories
                </p>
              </div>
            </section>
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
};

export default About;
