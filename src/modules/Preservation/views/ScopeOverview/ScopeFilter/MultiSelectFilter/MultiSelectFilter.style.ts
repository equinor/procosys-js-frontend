import styled from 'styled-components';
import { tokens } from '@equinor/eds-tokens';

export const SelectedItemsContainer = styled.div`
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    margin: 10px;
`;


export const Item = styled.div`
padding: 5px;
border-bottom: 1px solid black;
`;

export const SelectedItem = styled.span`
display: flex;
justify-content: 'center';
padding: 4px 8px;
margin-right: 5px;
margin-bottom: 8px;
border-radius: 5px;
font-size: 12px;
cursor: pointer;
line-height: 1.6em;
color: ${tokens.colors.interactive.primary__resting.rgba};
background-color: ${tokens.colors.interactive.primary__hover_alt.rgba};
svg {
    margin-right: 4px;
}

`;
