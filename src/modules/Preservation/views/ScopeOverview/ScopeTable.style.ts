import styled from 'styled-components';
import { tokens } from '@equinor/eds-tokens';

export const Toolbar = styled.div`
    margin-top: calc(var(--grid-unit) * 2);
    margin-bottom: var(--grid-unit);
`;

export const TagStatusLabel = styled.span`
    margin-left: auto;
    border-radius: calc(var(--grid-unit) * 2);
    padding: calc(var(--grid-unit) / 2) var(--grid-unit);    
    font-size: calc(var(--grid-unit) * 1.5);
    background: ${tokens.colors.interactive.primary__selected_highlight.rgba};
    color: ${tokens.colors.interactive.primary__resting.rgba};  
`;

export const TagLink = styled.span<{ isOverdue: boolean }>`
    color: ${(props): string => props.isOverdue
        ? tokens.colors.interactive.danger__text.rgba
        : tokens.colors.interactive.primary__resting.rgba};

    text-decoration: underline;
    cursor: pointer;
`;

interface RequirementIconProps {
    isDue: boolean;
    isReadyToBePreserved: boolean;
}

const getRequirementIconColor = (props: RequirementIconProps): string => {
    if (props.isDue && props.isReadyToBePreserved) {
        return tokens.colors.interactive.success__resting.rgba;
    }

    if (props.isDue && !props.isReadyToBePreserved) {
        return tokens.colors.interactive.danger__text.rgba;
    }

    return tokens.colors.text.static_icons__tertiary.rgba;
};

export const RequirementsContainer = styled.div`
    display: flex;

    span {
        /* avoid expanding the table row height */
        margin-bottom: -10px;
    }

    span:nth-of-type(n + 2) {
        margin-left: var(--grid-unit);
    }
`;

export const RequirementIcon = styled.span<RequirementIconProps>`
    svg path {
        fill: ${(props): string => getRequirementIconColor(props)};
    }
`;