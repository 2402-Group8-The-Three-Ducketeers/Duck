import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import duckimage from './images/duck-dash-page.png';

const HomeBody = () => {
  const { token } = useSelector(state => state.authorization);

  const renderContent = () => {
    if (token) {
      return (
        <div className="container">
          <img src={duckimage} alt="Duck Dash" style={{ width: '100%', height: '750px' }} />
          <div className="intro">
            <h1>WELCOME</h1>
            <section>
            <h2>CLICK START TO BEGIN YOUR ADVENTURE, OR SELECT FRIENDS TO CONNECT WITH OTHERS</h2>
            </section>
            <section className="intro-buttons">
              <Link to="/game">
                <button className="button1">Start</button>
              </Link>
              <button className="button2">Friends</button>
            </section>
          </div>
        </div>
      );
    } else {
      return (
        <div className="container">
          <img src={duckimage} alt="Duck Dash" style={{ width: '100%', height: '750px' }} />
          <div className="intro">
            <h1>DUCK DASH</h1>
            <h2>EMBARK ON THE PUDDLE'S CAPTIVATING JOURNEY</h2>
            <section className="intro-buttons">
              <Link to="/login">
                <button className="button1">Play</button>
              </Link>
              <button className="button2">Info</button>
            </section>
          </div>
        </div>
      );
    }
  };

  return renderContent();
};

export default HomeBody;