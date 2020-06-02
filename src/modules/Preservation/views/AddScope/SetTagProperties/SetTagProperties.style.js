import styled from 'styled-components';

export const Header = styled.header`
    display: flex;
    align-items: baseline;

    h1 {
        margin-right: calc(var(--grid-unit) * 2);
    };
`;

export const InputContainer = styled.div`
    margin: calc(var(--grid-unit) * 2) 0px;
    display: flex;
    flex-direction: row;
    align-items: center;
`;

export const Container = styled.div`
    display: grid;
    grid-template-columns: 1fr auto;
    margin-top: calc(var(--grid-unit) * 3);
`;

export const ButtonContainer = styled.div`
    display: flex;
    justify-content: center;
    button:last-of-type {
        margin-left: calc(var(--grid-unit) * 2);
    }
`;

export const CenterContent = styled.span`
    display: flex;
    align-items: center;
`;

export const RequirementMessage = styled.div`
    font-weight: bold;
    margin-top: calc(var(--grid-unit)*6);
`;
