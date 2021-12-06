import styled from 'styled-components';

export const Header = styled.header`
    display: flex;
    align-items: baseline;

    h1 {
        margin-right: calc(var(--grid-unit) * 2);
        margin-bottom: calc(var(--grid-unit) * 2);
        font-size: calc(var(--grid-unit) * 3);
        line-height: calc(var(--grid-unit) * 5);
    }
`;

export const Container = styled.div`
    display: flex;
    flex-direction: column;
    padding: calc(var(--grid-unit) * 2);
`;

export const InputContainer = styled.div`
    display: flex;
    margin-bottom: calc(var(--grid-unit) * 2);
    flex-direction: row;
    align-items: center;
`;

export const AttachmentsContainer = styled.div`
    display: flex;
    margin-bottom: calc(var(--grid-unit) * 2);
    flex-direction: column;
`;

export const ButtonContainer = styled.div`
    display: flex;
    justify-content: flex-end;
`;

export const ButtonSpacer = styled.div`
    margin-right: calc(var(--grid-unit) * 2);
`;
