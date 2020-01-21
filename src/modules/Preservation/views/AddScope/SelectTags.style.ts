import styled from 'styled-components';

export const Container = styled.div`
    display: flex;
    flex-direction: column;
`;

export const Header = styled.header`
    display: flex;
    align-items: baseline;
    
    h1 {
        margin-right: calc(var(--grid-unit) * 2);
    };
`;

export const ActionBar = styled.div`
    display: flex;
    margin-top: calc(var(--grid-unit) * 3);
`;

export const Search = styled.div`
    display: flex;
    flex: 1;

    input {
        width: 500px;
    }
`;

export const Next = styled.div`
    display: flex;
    flex: 1;
    flex-direction: column;
    align-items: flex-end;
    margin-right: calc(var(--grid-unit));
`;

export const Tags = styled.div`
    margin-top: calc(var(--grid-unit) * 4);    
`;

export const TagsHeader = styled.div`
    font-weight: bold;
    margin-bottom: calc(var(--grid-unit));
`;
