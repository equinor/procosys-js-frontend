import styled, { css } from 'styled-components';

import { tokens } from '@equinor/eds-tokens';

type FlexContainerProps = {
    width?: string;
    padding?: string;
    direction?: string;
}

type InlineContainerProps = {
    margin?: string;
}

type BadgeContainerProps = {
    iconBackground?: string;
    iconBorder?: boolean;
}
export const Container = styled.div`
    display: flex;
    flex-direction: column;
`;

export const StatusContainer = styled.div`
    display: flex;
    flex-direction: column;
    background-color: ${tokens.colors.ui.background__light.rgba};
    padding: calc(var(--grid-unit) * 2) var(--margin-module--right) calc(var(--grid-unit) * 4) var(--margin-module--right);
`;

export const FlexContainer = styled.div<FlexContainerProps>`
    display: flex;
    align-items: baseline;
    justify-content: space-between; 
    ${(props): any => props.width ? css`
        width: ${props.width};
    ` : css`
        width: "100%";
    `}
    ${(props): any => props.padding ? css`
        padding: ${props.padding};
    ` : css`
        padding: 0;
    `}
    ${(props): any => props.direction ? css`
        flex-direction: ${props.direction};
    ` : css`
        flex-direction: "row";
    `}
`;

export const InlineContainer = styled.div<InlineContainerProps>`
    display: inline-flex;
    justify-content: flex-start;
    align-items: center;
    gap: var(--grid-unit);


    ${(props): any => props.margin ? css`
        margin: ${props.margin};
    ` : css`
        margin: 0;
    `}
`;

export const BadgeContainer = styled.div<BadgeContainerProps>`
    display: inline-flex;
    justify-content: flex-start;
    align-items: center;
    gap: var(--grid-unit);
    margin: var(--grid-unit);
    
    > :first-child {
        border-radius: 50%;
        height: 16px;
        width: 16px;
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

export const HeaderContainer = styled.div`
    display: flex;
    justify-content: space-between;
    padding: calc(var(--grid - unit) * 2);
`;



export const CardDetail = styled.div`
    display: flex;
    align-items: flex-start;
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
