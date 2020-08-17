import styled from 'styled-components';
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

export const LibraryItemContainer = styled.div`
    display: flex;
    flex-direction: column;
    flex: 1;
    overflow-y: scroll;
    overflow-x: hidden;
`;

export const Breadcrumbs = styled.section`
    display: flex;
    align-items: center;
    width: 100%;
    padding: calc(var(--grid-unit) * 2);
`;
