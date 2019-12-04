import styled from 'styled-components';

export const Container = styled.div`
    margin-top: 50px;
    display: flex;
    align-items: center;
    height: 100%;
    flex-direction: column;
    h1 {
        font-size: 36px;
    }
`;

export const Button = styled.button`
    font-family: Equinor;
    font-style: normal;
    color: var(--text--primary-white);
    font-size: 14px;
    padding: 10px 16px;
    border-radius: 4px;
    border: none;
    background-color: var(--interactive-primary--resting);
    font-weight: 500;
`;
