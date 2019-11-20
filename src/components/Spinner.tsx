import React from 'react';
import styled from 'styled-components';

interface SpinnerSizeProps {
    small?: boolean;
    medium?: boolean;
    large?: boolean;
}

const Spinner: React.FC<SpinnerSizeProps> = ({ medium = false, large = false }: SpinnerSizeProps) => {
    let size = { width: 20, height: 20, radius: 5 };
    size = medium ? { width: 30, height: 30, radius: 10 } : size;
    size = large ? { width: 50, height: 50, radius: 20 } : size;

    return (
        <StyledSpinner viewBox={`0 0 ${size.width} ${size.height}`} {...size}>
            <circle
                className="path"
                cx={`${size.width / 2}`}
                cy={`${size.height / 2}`}
                r={`${size.radius}`}
                fill="none"
                strokeWidth="2"
            />
        </StyledSpinner>
    );
};

interface SpinnerProps {
    width: number;
    height: number;
}

const StyledSpinner = styled.svg<SpinnerProps>`
    animation: rotate 2s linear infinite;
    margin: -${(props): number => props.height / 2}px 0 -${(props): number => props.width / 2}px 0;
    width: ${(props): number => props.width}px;
    height: ${(props): number => props.height}px;

  & .path {
    stroke: #5652BF;
    stroke-linecap: round;
    animation: dash 1.5s ease-in-out infinite;
  }

  @keyframes rotate {
    100% {
      transform: rotate(360deg);
    }
  }
  @keyframes dash {
    0% {
      stroke-dasharray: 1, 150;
      stroke-dashoffset: 0;
    }
    50% {
      stroke-dasharray: 90, 150;
      stroke-dashoffset: -35;
    }
    100% {
      stroke-dasharray: 90, 150;
      stroke-dashoffset: -124;
    }
  }
`;

export default Spinner;
