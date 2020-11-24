import styled, { css } from 'styled-components';

import { tokens } from '@equinor/eds-tokens';

type BadgeContainerProps = {
    iconBackground?: string;
    iconBorder?: boolean;
}
export const Container = styled.div`
    display: flex;
    flex-direction: column;
    width: inherit;
`;

export const StatusContainer = styled.div`
    display: flex;
    flex-direction: column;
    background-color: ${tokens.colors.ui.background__light.rgba};
    padding: calc(var(--grid-unit) * 2) var(--margin-module--right) calc(var(--grid-unit) * 4) var(--margin-module--right);
`;

export const HeaderContainer = styled.div`
    display: flex;
    align-items: baseline;
    justify-content: space-between; 
    padding: var(--grid-unit) calc(var(--grid-unit) * 2);
    width: 100%;
`;

export const OutlookInformationHeaderContainer = styled.div`
    display: flex;
    align-items: baseline;
    justify-content: space-between; 
    padding: calc(var(--grid-unit) * 2) calc(var(--grid-unit) * 4) calc(var(--grid-unit) * 2) calc(var(--grid-unit) * 2);
`;


export const OutlookInformationStatusContainer = styled.div`
    display: flex;
    align-items: baseline;
    justify-content: space-between; 
    padding: calc(var(--grid-unit)) 0;
    width: 100%;
`;

export const ParticipantListContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: baseline;
    justify-content: space-between; 
    width: 100%;
    padding: calc(var(--grid-unit) * 2);
`;

export const ParticipantContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: baseline;
    justify-content: space-between; 
    width: 100%;
    padding: var(--grid-unit) calc(var(--grid-unit) * 2);
`;

export const InlineContainer = styled.div`
    display: inline-flex;
    justify-content: flex-start;
    align-items: center;
    gap: var(--grid-unit);
    margin: 0;
`;

export const BadgeContainer = styled.div<BadgeContainerProps>`
    display: inline-flex;
    justify-content: flex-start;
    align-items: center;
    gap: var(--grid-unit);
    margin: calc(var(--grid-unit) * 2) var(--grid-unit);
    
    > :first-child {
        border-radius: 50%;
        height: calc(var(--grid-unit) * 2);
        width: calc(var(--grid-unit) * 2);
        min-width: 16px;
        padding: 2px;
        text-align: center;
        margin-right: var(--grid-unit);
    }

    ${(props): any => props.iconBackground && css`
            > :first-child {
                background: ${props.iconBackground} !important;
            }
        `}
        
    ${(props): any => props.iconBorder && css`
        > :first-child {
            border: 1px solid ${tokens.colors.ui.background__medium.rgba};
            background: ${tokens.colors.ui.background__light.rgba} !important;
        }
    `}
`;

// export const HeaderContainer = styled.div`
//     display: flex;
//     justify-content: space-between;
//     padding: calc(var(--grid - unit) * 2);
// `;



export const CardDetail = styled.div`
    display: flex;
    align-items: center;
    gap: var(--grid-unit);
`;

export const Card = styled.div`
    display: flex;
    align-items: flex-start;
    width: fit-content;
    padding: var(--grid-unit) calc(var(--grid-unit) * 2);
    margin: calc(var(--grid-unit) * 2) 0;
    background: var(--ui-background--default);
    border-radius: calc(var(--grid-unit) / 2);
    border: 1px solid ${tokens.colors.interactive.disabled__fill.rgba};
`;
