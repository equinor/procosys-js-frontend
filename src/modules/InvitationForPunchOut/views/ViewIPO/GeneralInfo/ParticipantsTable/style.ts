import styled from 'styled-components';

export const Container = styled.div`
    position: relative;
    margin: 0;
    padding: 0;
    width: 100%;
`;

export const CustomTable = styled.table`
    position: relative;
    display: block;
    overflow-x: auto;
    white-space: nowrap;
    width: 100%;
`;

export const SpinnerContainer = styled.div`
    position: absolute;
    display: flex;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.01);
    z-index: 9999;
    align-items: center;
    justify-content: center;
`;



