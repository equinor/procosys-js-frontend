import styled from 'styled-components';

export const Container = styled.div`
    position: relative;
    margin: 0;
    padding: 0;
    width: 100%;
    overflow: visible;
    height: auto;
`;

export const CustomTable = styled.table`
    position: relative;
    display: block;
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
    background: rgba(255, 255, 255, 0.5);
    z-index: 9999;
    align-items: center;
    justify-content: center;
`;

export const ResponseWrapper = styled.div`
    display: flex;
    align-items: center;
`;
