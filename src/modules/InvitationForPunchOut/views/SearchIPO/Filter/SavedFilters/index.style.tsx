import styled, { css } from 'styled-components';
import { tokens } from '@equinor/eds-tokens';

//TODO: check that all of this looks correct here too!

interface SavedFiltersProps {
    isSelectedFilter?: boolean;
}

export const Container = styled.div`
    display: flex;
    flex-direction: column;
`;

export const ListContainer = styled.div`
    display: flex;
    flex-direction: column;  
`;

export const Link = styled.div`
    display: flex;
    align-items:center;
    :hover {
        cursor: pointer;
    }
`;

export const Row = styled.div<SavedFiltersProps>`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    ${ ({ isSelectedFilter }): any => isSelectedFilter && css`
        background:${tokens.colors.interactive.primary__selected_highlight.rgba};
    `};
    :hover {
        cursor: pointer;
    }
`;


