import React from 'react';
import Navbar from '../Layout/NavBar';
import homeimg from '../Assets/home_img.png';

const Home: React.FC = () => {
  return (
    <>
      <Navbar />
      <div className="bg-[#63C6F7] min-h-screen pt-16">
        <div className="mx-auto px-[189px] py-16 h-full grid grid-cols-1 md:grid-cols-[30%_70%] gap-12">
          
          {/* Left Text Section */}
          <div className="flex flex-col justify-center text-left">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-8">
              From Hearts to Homes
              <br />
              Bridging Needs with
              <br />
              Kindness.
            </h1>
            <p className="text-lg text-white mb-8 leading-relaxed max-w-xl">
              Transform Lives with Every Donation! Our platform connects generous donors
              with children and elderly care homes, ensuring that your contributions go
              exactly where they're needed most. With real-time inventory updates and a
              built-in chat feature, you can easily select the perfect items and communicate
              directly with care homes to make a meaningful impact. Join us in creating
              brighter tomorrows, one donation at a time.
            </p>
          </div>
          
          {/* Right Larger Image Section */}
          <div className="flex justify-end h-full">
            <img
              src={homeimg}
              alt="home_img"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
