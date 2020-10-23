import styled from 'styled-components';

export const Container = styled.div`
    position: relative;
    margin: var(--margin-module--top) var(--margin-module--right);
`;

export const HeaderContainer = styled.div`
    height: calc(var(--grid-unit) * 4);
`;

export const ProjectInfoContainer = styled.div`
    margin: var(--grid-unit) var(--grid-unit) calc(var(--grid-unit) * 4) var(--grid-unit);
    max-width: 600px;
`;

export const ProjectInfoDetail = styled.div`
    line-height: 24px;
    margin: var(--grid-unit) 0;
`;

export const DetailContainer = styled.div`
    display: flex;
    align-items: center;
`;

export const DateTimeItem = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: var(--margin-module-top);
    margin: 0 calc(var(--grid-unit) * 4) 0 0;
`;

export const ButtonsContainer = styled.div`
    position: absolute;
    top: 0;
    right: 0;
    display: flex;
    justify-content: space-between;
    width: 300px;
`;
