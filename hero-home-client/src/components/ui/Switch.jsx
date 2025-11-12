import React from 'react';
import styled from 'styled-components';
import { useTheme } from '../../contexts/ThemeContext';

const Switch = () => {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <StyledWrapper>
      <div className="container">
        <input 
          type="checkbox" 
          name="checkbox" 
          id="checkbox" 
          checked={isDarkMode}
          onChange={toggleTheme}
        />
        <label htmlFor="checkbox" className="label"> </label>
      </div>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  .container {
  }

  .label {
    height: 36px;
    width: 72px;
    background-color: #ffffff;
    border-radius: 18px;
    -webkit-box-shadow: inset 0 0 3px 2px rgba(255, 255, 255, 1),
      inset 0 0 12px 1px rgba(0, 0, 0, 0.488), 6px 12px 18px rgba(0, 0, 0, 0.096),
      inset 0 0 0 2px rgba(0, 0, 0, 0.3);
    box-shadow: inset 0 0 3px 2px rgba(255, 255, 255, 1),
      inset 0 0 12px 1px rgba(0, 0, 0, 0.488), 6px 12px 18px rgba(0, 0, 0, 0.096),
      inset 0 0 0 2px rgba(0, 0, 0, 0.3);
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    cursor: pointer;
    position: relative;
    -webkit-transition: -webkit-transform 0.4s;
    transition: -webkit-transform 0.4s;
    transition: transform 0.4s;
  }

  .label:hover {
    -webkit-transform: perspective(100px) rotateX(5deg) rotateY(-5deg);
    transform: perspective(100px) rotateX(5deg) rotateY(-5deg);
  }

  #checkbox:checked ~ .label:hover {
    -webkit-transform: perspective(100px) rotateX(-5deg) rotateY(5deg);
    transform: perspective(100px) rotateX(-5deg) rotateY(5deg);
  }

  #checkbox {
    display: none;
  }

  #checkbox:checked ~ .label::before {
    left: 42px;
    background-color: #000000;
    background-image: linear-gradient(315deg, #000000 0%, #414141 70%);
    -webkit-transition: 0.4s;
    transition: 0.4s;
  }

  .label::before {
    position: absolute;
    content: "";
    height: 24px;
    width: 24px;
    border-radius: 50%;
    background-color: #000000;
    background-image: linear-gradient(
      130deg,
      #757272 10%,
      #ffffff 11%,
      #726f6f 62%
    );
    left: 6px;
    -webkit-box-shadow: 0 1px 1px rgba(0, 0, 0, 0.3),
      6px 6px 6px rgba(0, 0, 0, 0.3);
    box-shadow: 0 1px 1px rgba(0, 0, 0, 0.3), 6px 6px 6px rgba(0, 0, 0, 0.3);
    -webkit-transition: 0.4s;
    transition: 0.4s;
  }`;

export default Switch;
