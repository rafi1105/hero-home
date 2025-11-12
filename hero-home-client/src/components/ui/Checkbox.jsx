import React from 'react';
import styled from 'styled-components';

const Checkbox = ({ checked, onChange, label }) => {
  return (
    <StyledWrapper>
      <label className="container">
        {label && <span className="label-text">{label}</span>}
        <input type="checkbox" checked={checked} onChange={onChange} />
        <div className="checkmark" />
      </label>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  .container input {
    display: flex;
    align-items: center;
    justify-content: center;
    position: absolute;
    opacity: 0;
    cursor: pointer;
    height: 0;
    width: 0;
  }

  .container {
    display: flex;
    align-items: center;
    gap: 10px;
    position: relative;
    cursor: pointer;
    font-size: 20px;
    user-select: none;
  }

  .label-text {
    color: var(--text-color);
    font-size: 16px;
  }

  .checkmark {
    position: relative;
    top: 0;
    left: 0;
    height: 1.3em;
    width: 1.3em;
    background-color: #2dc38c;
    border: 3px solid #beddd0;
    border-radius: 10px;
    overflow: hidden;
    border-bottom: 1.5px solid #2dc38c;
    box-shadow: 0 0 1px #cef1e4, inset 0 -2.5px 3px #62eab8,
      inset 0 3px 3px rgba(0, 0, 0, 0.34);
    transition: transform 0.3s ease-in-out;
  }

  .container input:checked ~ .checkmark {
    transform: translateY(40px);
    animation: wipeDown 0.6s ease-in-out forwards;
  }

  .container input:not(:checked) ~ .checkmark {
    transform: translateY(-40px);
    animation: wipeUp 0.6s ease-in-out forwards;
  }

  @keyframes wipeDown {
    0% {
      transform: translateY(0);
    }
    100% {
      transform: translateY(40px);
    }
  }

  @keyframes wipeUp {
    0% {
      transform: translateY(40);
    }
    100% {
      transform: translateY(0px);
    }
  }

  .checkmark:after {
    content: "";
    position: absolute;
    display: none;
  }

  .container input:checked ~ .checkmark:after {
    display: block;
  }

  .container .checkmark:before {
    content: "";
    position: absolute;
    left: 10px;
    top: 4px;
    width: 5px;
    height: 10px;
    border: solid white;
    border-width: 0 2px 2px 0;
    transform: rotate(45deg);
    box-shadow: 0 4px 2px rgba(0, 0, 0, 0.34);
  }`;

export default Checkbox;
