import React from 'react';
import './Header.css';

const Header = ({ title, subTitle }) => (
  <div
    className="Header-pageHeader"
  >
    <span className="Header-title"><h3>{title}</h3></span>
    {' '}
    <p>{subTitle}</p>

  </div>

);

export default Header;
