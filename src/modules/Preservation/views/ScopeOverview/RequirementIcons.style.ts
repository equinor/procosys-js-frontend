import styled from 'styled-components';
import { tokens } from '@equinor/eds-tokens';

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
