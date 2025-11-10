import React from "react";
import {
  MdOutlineDesignServices,
  MdOutlineWebhook,
  MdAccountBalance,
  MdOutlineAnimation,
} from "react-icons/md";
import { TbAppsFilled } from "react-icons/tb";
import { FaReact } from "react-icons/fa";
import { GiArtificialIntelligence } from "react-icons/gi";
import { IoGameController } from "react-icons/io5";

const PopularCategories = () => {
  const categories = [
    { id: 1, title: "Graphics & Design", subTitle: "Open Positions", icon: <MdOutlineDesignServices /> },
    { id: 2, title: "Mobile App Development", subTitle: "Open Positions", icon: <TbAppsFilled /> },
    { id: 3, title: "Frontend Web Development", subTitle: "Open Positions", icon: <MdOutlineWebhook /> },
    { id: 4, title: "Backend Development", subTitle: "Open Positions", icon: <MdOutlineWebhook /> },
    { id: 5, title: "Full Stack Development", subTitle: "Open Positions", icon: <MdOutlineWebhook /> },
    { id: 6, title: "MERN Stack Development", subTitle: "Open Positions", icon: <FaReact /> },
    { id: 7, title: "Account & Finance", subTitle: "Open Positions", icon: <MdAccountBalance /> },
    { id: 8, title: "Artificial Intelligence", subTitle: "Open Positions", icon: <GiArtificialIntelligence /> },
    { id: 9, title: "Machine Learning", subTitle: "Open Positions", icon: <GiArtificialIntelligence /> },
    { id: 10, title: "Data Science", subTitle: "Open Positions", icon: <GiArtificialIntelligence /> },
    { id: 11, title: "DevOps & Cloud", subTitle: "Open Positions", icon: <MdOutlineWebhook /> },
    { id: 12, title: "Cyber Security", subTitle: "Open Positions", icon: <MdOutlineWebhook /> },
    { id: 13, title: "Blockchain & Web3", subTitle: "Open Positions", icon: <MdOutlineWebhook /> },
    { id: 14, title: "UI/UX Design", subTitle: "Open Positions", icon: <MdOutlineDesignServices /> },
    { id: 15, title: "Video Animation", subTitle: "Open Positions", icon: <MdOutlineAnimation /> },
    { id: 16, title: "Game Development", subTitle: "Open Positions", icon: <IoGameController /> },
  ];
  return (
    <div className="categories">
      <h3>POPULAR CATEGORIES</h3>
      <div className="banner">
        {categories.map((element) => {
          return (
            <div className="card" key={element.id}>
              <div className="icon">{element.icon}</div>
              <div className="text">
                <p>{element.title}</p>
                <p>{element.subTitle}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PopularCategories;
