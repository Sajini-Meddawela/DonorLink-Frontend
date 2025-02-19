import React from "react";
import { Link } from "react-router-dom";
import {
  FacebookFilled,
  TwitterSquareFilled,
  InstagramFilled,
  YoutubeFilled,
} from "@ant-design/icons";

const Footer = () => {
  return (
    <div className="w-full fixed gap-8 text-black bottom-0 m-0">
      <div className="">
        <div className="flex justify-center gap-2 md:w-full">
          <FacebookFilled className="text-black text-xl p-2" />
          <InstagramFilled className="text-black text-xl p-2" />
          <TwitterSquareFilled className="text-black text-xl p-2" />
          <YoutubeFilled className="text-black text-xl p-2" />
        </div>
      </div>
      <div className="text-center mt-2">
        <Link to = "/">Home</Link> | About Us | Chats | My List | FAQs | Terms and Conditions |
        Privacy Policy
      </div>
    </div>
  );
};

export default Footer;
