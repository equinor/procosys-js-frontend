import styled from 'styled-components';

export const Modal = styled.div`
    display: block;
    position: fixed;
    padding-top: 50px;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background-color: rgb(0, 0, 0); 
    background-color: rgba(0, 0, 0, 0.5);
    z-index:100; 
`;

export const ModalContent = styled.div`
    margin: auto;
    min-width: 250px;
    box-shadow: 0px 3px 5px rgba(0, 0, 0, 0.2), 0px 1px 18px rgba(0, 0, 0, 0.12),
    0px 6px 10px rgba(0, 0, 0, 0.14);
    border-radius: 4px;
    position: relative;
    background-color: white;
    padding: calc(var(--grid-unit) * 2);
    width: calc(var(--grid-unit) * 100);
    margin-top: 300px;    
    padding-bottom: calc(var(--grid-unit) * 8);
    `;

export const ButtonContainer = styled.div`
    float: right;
    bottom: 0px; 
    padding: calc(var(--grid-unit));
`;

