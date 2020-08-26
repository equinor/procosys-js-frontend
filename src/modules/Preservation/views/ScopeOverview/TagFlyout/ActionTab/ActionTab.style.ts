import styled, { css } from 'styled-components';
import { tokens } from '@equinor/eds-tokens';
import { Button } from '@equinor/eds-core-react';

export const Container = styled.div`
    display:flex;
    flex-direction: column; 
    justify-content: flex-end;

`;

export const AddActionContainer = styled.div`
    display:flex;
    justify-content: flex-end;
    padding: calc(var(--grid-unit) * 2) calc(var(--grid-unit) * 4);
    align-items:center;
    cursor: pointer;
`;

export const IconSpacer = styled.div`
   margin-right: calc(var(--grid-unit) * 4);
`;

export const ActionList = styled.div`
    margin: 0px calc(var(--grid-unit) * 2) 0px calc(var(--grid-unit) * 2);
    border-top: solid 1px  ${tokens.colors.interactive.primary__resting.rgba};
`;

export const ActionContainer = styled.div<{ isClosed: boolean }>`

    ${(props): any => props.isClosed && css`
        border-left: solid 1px ${tokens.colors.ui.background__medium.rgba};
        border-right: solid 1px ${tokens.colors.ui.background__medium.rgba};
        `}; 

    ${(props): any => !props.isClosed && css`
        border-left: solid 1px  ${tokens.colors.interactive.primary__resting.rgba};
        border-right: solid 1px ${tokens.colors.interactive.primary__resting.rgba};
    `}; 

    font-weight: 500;
    font-size: calc(var(--grid-unit) * 2);
    line-height: calc(var(--grid-unit) * 2);

    svg path {
        color: ${tokens.colors.interactive.primary__resting.rgba};
    }
`;

export const Collapse = styled.div<{ isClosed: boolean }>`
    display: flex;
    padding-right: calc(var(--grid-unit) * 2);

    ${(props): any => props.isClosed && css`
        border-bottom: solid 1px ${tokens.colors.ui.background__medium.rgba};
    `}; 

    ${(props): any => !props.isClosed && css`
        border-bottom: solid 1px ${tokens.colors.interactive.primary__resting.rgba};
    `}; 

    align-items: center;
`;

export const CollapseInfo = styled.div<{ isExpanded: boolean; isClosed: boolean }>`
    flex-grow: 1;
    padding-top: calc(var(--grid-unit) + 4px);
    padding-right: calc(var(--grid-unit) * 2);
    padding-bottom: calc(var(--grid-unit) + 4px);
    padding-left: calc(var(--grid-unit) * 2);    
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;

    ${(props): any => props.isExpanded && !props.isClosed && css`
        color:${tokens.colors.interactive.primary__resting.rgba};
    `}; 
`;

export const StyledButton = styled(Button)`
    display: flex;
    align-items: center;
    justify-content: center;
    margin-left: var(--grid-unit);

    :hover {
        background: ${tokens.colors.interactive.primary__hover_alt.rgba};
    }

    svg path {
        color: ${tokens.colors.interactive.primary__resting.rgba};
    }
`;
