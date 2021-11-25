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
    addPaddingRight: boolean;
}

export const LibraryItemContainer = styled.div<LibraryItemProps>`
    display: flex;
    flex-direction: column;
    flex: 1;
    overflow-y: scroll;
    overflow-x: hidden;
    ${(props): any =>
        props.addPaddingRight &&
        css`
            padding-right: calc(var(--grid-unit) * 2);
        `}
`;

export const Breadcrumbs = styled.section`
    display: flex;
    align-items: center;
    width: 100%;
    padding: calc(var(--grid-unit) * 2);
`;

export const ButtonContainer = styled.div`
    display: flex;
    justify-content: space-between;
    width: 100%;
    flex-wrap: wrap;
`;

export const ButtonContainerRight = styled.div`
    display: flex;
    justify-content: flex-end;
`;

export const ButtonContainerLeft = styled.div`
    display: flex;
    justify-content: flex-start;
`;
