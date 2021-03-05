import styled, { css } from 'styled-components';
import { tokens } from '@equinor/eds-tokens';

interface SavedFiltersProps {
    isSelectedFilter?: boolean;
}

export const Container = styled.div`
    display: flex;
    flex-direction: column;
    margin: calc(var(--grid-unit) * 2);
    min-width: 300px;
`;

export const Header = styled.header`
    display: flex;
    align-items:center;
    justify-content: space-between;
`;

export const Divider = styled.div`
    border-top: 1px solid ${tokens.colors.interactive.disabled__border.rgba};      
    box-sizing: border-box;
    margin-top: var(--grid-unit);
    padding-bottom: var(--grid-unit);
`;

export const ListContainer = styled.div`
    display: flex;
    flex-direction: column;  
`;

export const Link = styled.div`
    display: flex;
    align-items: center;
    width: 100%;
    :hover {
        cursor: pointer;
    }
`;

export const Row = styled.div<SavedFiltersProps>`
    display: flex;
    ${ ({ isSelectedFilter }): any => isSelectedFilter && css`
        background:${tokens.colors.interactive.primary__selected_highlight.rgba};
    `};
    :hover {
        cursor: pointer;
    }
`;


