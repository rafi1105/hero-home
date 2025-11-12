import React from 'react';
import styled from 'styled-components';

const Button = ({ children, variant = 'primary', onClick, disabled, className, isDark, isActive, ...props }) => {
  // Filter out non-DOM props before spreading to button element
  const { ...buttonProps } = props;
  
  return (
    <StyledWrapper variant={variant} disabled={disabled} $isDark={isDark} $isActive={isActive}>
      <button 
        className={`button ${className || ''} ${isActive ? 'active' : ''}`} 
        onClick={onClick} 
        disabled={disabled}
        {...buttonProps}
      >
        {children}
      </button>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  position: relative;
  display: inline-block;
  
  ${props => props.variant === 'primary' && `
    padding: 3px;
    background: linear-gradient(90deg, #03a9f4, #f441a5);
    border-radius: 0.9em;
    transition: all 0.4s ease;
    
    &::before {
      content: "";
      position: absolute;
      inset: 0;
      margin: auto;
      border-radius: 0.9em;
      z-index: -10;
      filter: blur(0);
      transition: filter 0.4s ease;
    }
    
    &:hover::before {
      background: linear-gradient(90deg, #03a9f4, #f441a5);
      filter: blur(1.2em);
    }
    
    &:active::before {
      filter: blur(0.2em);
    }
  `}
  
  ${props => props.variant === 'category' && `
    padding: 0;
    background: transparent;
  `}
  
  ${props => props.variant === 'apply' && `
    padding: 3px;
    background: linear-gradient(135deg, #667eea, #764ba2);
    border-radius: 0.5em;
    transition: all 0.4s ease;
    
    &::before {
      content: "";
      position: absolute;
      inset: 0;
      margin: auto;
      border-radius: 0.5em;
      z-index: -10;
      filter: blur(0);
      transition: filter 0.4s ease;
    }
    
    &:hover::before {
      background: linear-gradient(135deg, #667eea, #764ba2);
      filter: blur(1em);
    }
  `}
  
  ${props => props.variant === 'hero' && `
    padding: 3px;
    background: linear-gradient(82.3deg, #4700B0 10.8%, #7b4dff 94.3%);
    border-radius: 1.5rem;
    transition: all 0.4s ease;
    
    &::before {
      content: "";
      position: absolute;
      inset: 0;
      margin: auto;
      border-radius: 1.5rem;
      z-index: -10;
      filter: blur(0);
      transition: filter 0.4s ease;
    }
    
    &:hover::before {
      background: linear-gradient(82.3deg, #4700B0 10.8%, #7b4dff 94.3%);
      filter: blur(1.2em);
    }
  `}
  
  .button {
    position: relative;
    z-index: 1;
    border: none;
    cursor: pointer;
    font-weight: 600;
    transition: all 0.3s ease;
    
    ${props => props.variant === 'primary' && `
      font-size: 1.4em;
      padding: 0.6em 0.8em;
      border-radius: 0.5em;
      background-color: #000;
      color: #fff;
      box-shadow: 2px 2px 3px #000000b4;
      
      &:hover {
        transform: translateY(-2px);
      }
      
      &:active {
        transform: translateY(0);
      }
    `}
    
    ${props => props.variant === 'category' && `
      font-size: 1rem;
      padding: 0.7rem 1.5rem;
      border-radius: 25px;
      border: 2px solid #2d2d44;
      background: #1a1a2e;
      color: #fff;
      
      &:hover {
        border-color: #667eea;
        transform: translateY(-2px);
      }
      
      &.active {
        background: linear-gradient(135deg, #667eea, #764ba2);
        border-color: transparent;
        box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
      }
    `}
    
    ${props => props.variant === 'apply' && `
      font-size: 1rem;
      padding: 0.7rem 1.5rem;
      border-radius: 0.4em;
      background: linear-gradient(135deg, #667eea, #764ba2);
      color: white;
      box-shadow: 2px 2px 3px rgba(0, 0, 0, 0.3);
      
      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
      }
    `}
    
    ${props => props.variant === 'hero' && `
      font-size: 1.125rem;
      padding: 0 2rem;
      height: 3rem;
      border-radius: 1.4rem;
      background: linear-gradient(82.3deg, #4700B0 10.8%, #7b4dff 94.3%);
      color: #fff;
      box-shadow: 0 4px 15px rgba(71, 0, 176, 0.3);
      
      &:hover {
        transform: translateY(-3px);
        box-shadow: 0 6px 20px rgba(71, 0, 176, 0.4);
      }
      
      &:active {
        transform: translateY(-1px);
      }
    `}
    
    &:disabled {
      opacity: 0.6;
      cursor: not-allowed;
      
      &:hover {
        transform: none;
      }
    }
  }
`;

export default Button;
