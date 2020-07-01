import styled, { css } from 'styled-components';
import { tokens } from '@equinor/eds-tokens';

export const Container = styled.div`
    display: flex;
    width: 100%;
    height: 100%;
    overflow: hidden;
`;

export const Divider = styled.div`
    border-left: solid 1px ${tokens.colors.ui.background__medium.rgba};
`;

interface LibraryItemProps {
    addPaddingTop: boolean;
}

export const LibraryItemContainer = styled.div<LibraryItemProps>`
    display: flex;
    flex: 1;
    overflow-y: scroll;
    overflow-x: hidden;
    ${(props): any => props.addPaddingTop && css`
        padding-top: var(--margin-module--top);
    `}
`;
