import React from 'react';
import './Header.css';

const Header = ({ title, subTitle, logo }) => (
  <div
    className="Header-pageHeader"
  >
    <span className="Header-title"><h3>{title}</h3></span>
    {' '}

    <div className="powered-by">
      <span>{subTitle}</span>
      <img alt="logo" src={logo} />
    </div>

  </div>

);

export default Header;
