import styled, { css } from 'styled-components';
import { tokens } from '@equinor/eds-tokens';

export const Container = styled.div`
    display: flex;
    justify-content: space-between;
`;

interface StepProps {
    currentStep: boolean;
    stepCompleted: boolean;
}

export const StepContainer = styled.div<StepProps>`
    display: flex;
    font-weight: bold;
    align-items: center;
    white-space: nowrap;
    width: 100%;

    > div:first-child {
        border-radius: 50%;
        height: 16px;
        width: 16px;
        min-width: 16px;
        padding: 2px;
        text-align: center;
        margin-right: var(--grid-unit);
    }

    ${(props): any => !props.currentStep && !props.stepCompleted && css`
        color: ${tokens.colors.interactive.disabled__text.rgba};
        > div:first-child {
            border: 2px solid ${tokens.colors.interactive.disabled__border.rgba};
        }
    `}
    
    ${(props): any => props.currentStep && css`
        > div:first-child {
            border: 2px solid ${tokens.colors.interactive.primary__resting.rgba};
            background-color: ${tokens.colors.interactive.primary__resting.rgba};
            color: white;
        }
    `}

    ${(props): any => props.stepCompleted && css`
        font-weight: normal;
        > div:first-child {
            border: 2px solid ${tokens.colors.interactive.primary__resting.rgba};
            svg {
                fill: ${tokens.colors.interactive.primary__resting.rgba};
            }
        }
        .line {
            border-bottom: 1px solid ${tokens.colors.interactive.primary__resting.rgba} !important;
        }
    `}

    ${(props): any => props.stepCompleted && props.currentStep && css`
        font-weight: bold;
        > div:first-child {
            border: 2px solid ${tokens.colors.interactive.primary__resting.rgba};
            svg {
                fill: ${tokens.colors.interactive.primary__resting.rgba};
            }
        }
        .line {
            border-bottom: 1px solid ${tokens.colors.interactive.primary__resting.rgba} !important;
        }
    `}

    .line {
        width: 100%;
        min-width: 5px;
        margin-left: var(--grid-unit);
        margin-right: calc(var(--grid-unit) * 2);
        border-bottom: 1px solid ${tokens.colors.interactive.disabled__border.rgba};
    }
`;
