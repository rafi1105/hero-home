import React from 'react';
import styled from 'styled-components';
import { useTheme } from '../../contexts/ThemeContext';

const Checkbox = ({ checked, onChange, label }) => {
  const { isDarkMode } = useTheme();
  
  return (
    <StyledWrapper $isDark={isDarkMode}>
      <label className="checkbox-container">
        <input type="checkbox" checked={checked} onChange={onChange} />
        <svg viewBox="0 0 64 64" height="2em" width="2em">
          <path
            d="M 0 16 V 56 A 8 8 90 0 0 8 64 H 56 A 8 8 90 0 0 64 56 V 8 A 8 8 90 0 0 56 0 H 8 A 8 8 90 0 0 0 8 V 16 L 32 48 L 64 16 V 8 A 8 8 90 0 0 56 0 H 8 A 8 8 90 0 0 0 8 V 56 A 8 8 90 0 0 8 64 H 56 A 8 8 90 0 0 64 56 V 16"
            pathLength="575.0541381835938"
            className="path"
          ></path>
        </svg>
        {label && <span className="label-text">{label}</span>}
      </label>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  .checkbox-container {
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 12px;
    position: relative;
  }

  .label-text {
    color: ${props => props.$isDark ? '#fff' : '#212529'};
    font-size: 1rem;
    font-weight: 500;
    user-select: none;
    transition: color 0.3s ease;
  }

  .checkbox-container input[type="checkbox"] {
    position: absolute;
    opacity: 0;
    width: 0;
    height: 0;
  }

  .checkbox-container svg {
    overflow: visible;
  }

  .path {
    fill: none;
    stroke: ${props => props.$isDark ? '#667eea' : '#4700B0'};
    stroke-width: 6;
    stroke-linecap: round;
    stroke-linejoin: round;
    transition: stroke-dasharray 0.5s ease, stroke-dashoffset 0.5s ease;
    stroke-dasharray: 241 9999999;
    stroke-dashoffset: 0;
  }

  .checkbox-container input[type="checkbox"]:checked ~ svg .path {
    stroke-dasharray: 70.5096664428711 9999999;
    stroke-dashoffset: -262.2723388671875;
    stroke: ${props => props.$isDark ? '#764ba2' : '#4700B0'};
  }

  .checkbox-container:hover .path {
    stroke: ${props => props.$isDark ? '#764ba2' : '#667eea'};
    filter: drop-shadow(0 0 8px rgba(102, 126, 234, 0.4));
  }

  .checkbox-container input[type="checkbox"]:checked ~ .label-text {
    color: ${props => props.$isDark ? '#764ba2' : '#4700B0'};
  }
`;

export default Checkbox;
