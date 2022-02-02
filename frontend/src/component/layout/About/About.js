import React from "react";
import "./aboutSection.css";
import { Button, Typography, Avatar } from "@material-ui/core";
import YouTubeIcon from "@material-ui/icons/YouTube";
import InstagramIcon from "@material-ui/icons/Instagram";
const About = () => {
  const visitInstagram = () => {
    window.location = "http://www.instagram.com/mithunsingh1510/";
  };
  return (
    <div className="aboutSection">
      <div></div>
      <div className="aboutSectionGradient"></div>
      <div className="aboutSectionContainer">
        <Typography component="h1">About Us</Typography>

        <div>
          <div>
            <Avatar
              style={{ width: "10vmax", height: "10vmax", margin: "2vmax 0" }}
              src="https://res.cloudinary.com/drbyjco45/image/upload/v1643562132/IMG_20211129_155656_759_1_htsoef.jpg"
              alt="Founder"
            />
            <Typography>Mithun Singh</Typography>
            <Button onClick={visitInstagram} color="primary">
              Visit Instagram
            </Button>
            <span>
              This is a MERN Stack wesbite made by Mithun Singh. Lorem ipsum dolor sit amet consectetur adipisicing elit. Quo eos tempora quis, incidunt iure at voluptatem magni! Consequatur, tempore perferendis ullam dolor deserunt animi excepturi doloribus impedit magnam ut voluptatibus laudantium inventore. Sapiente, incidunt.
            </span>
          </div>
          <div className="aboutSectionContainer2">
            <Typography component="h2">Our Brands</Typography>
            <a
              href="https://www.youtube.com/channel/UCAC-uc69YUEig1aqa7AcrwA"
              target="blank"
            >
              <YouTubeIcon className="youtubeSvgIcon" />
            </a>

            <a href="http://www.instagram.com/mithunsingh1510/" target="blank">
              <InstagramIcon className="instagramSvgIcon" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
