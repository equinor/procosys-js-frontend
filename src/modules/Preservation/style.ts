import styled from 'styled-components';
import { tokens } from '@equinor/eds-tokens';

export const ClosedProjectContainer = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    font-size: 16px;
    padding: 
        calc(var(--grid-unit) * 2 ) 
        calc(var(--grid-unit) * 2 ) 
        calc(var(--grid-unit) * 2 ) 
        calc(var(--grid-unit) * 3 );     
    background: ${tokens.colors.ui.background__warning.rgba};
`;

export const TextSpacer = styled.div`
    margin-right: calc(var(--grid-unit) * 4);
`;

