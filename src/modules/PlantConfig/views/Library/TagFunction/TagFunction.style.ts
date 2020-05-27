import styled, {css} from 'styled-components';
import { tokens } from '@equinor/eds-tokens';

export const Breadcrumbs = styled.section`
    display: flex;
    border-bottom: 1px solid ${tokens.colors.ui.background__medium.rgba};
    align-items: center;
    width: 100%;
    padding: var(--grid-unit);
`;

export const Divider = styled.div`
    margin-top: calc(var(--margin-module--top) * -1);
    margin-bottom: -1000px;
    margin-right: calc(var(--grid-unit) * 2);
    margin-left: calc(var(--grid-unit) * 5);
    border-left: solid 1px ${tokens.colors.ui.background__medium.rgba};
`;

export const DetailsSection = styled.section`
    background-color: ${tokens.colors.ui.background__light.rgba};
    padding: calc(var(--grid-unit)*2) calc(var(--grid-unit)*4);
`;

export const Container = styled.div`
    display: flex;
    flex: 1;
    flex-direction: column;
    margin-right: calc(var(--margin-module--right) *-1);
    margin-top: calc(var(--margin-module--top) *-1);
`;

export const SpinnerContainer = styled.div`
    display: flex;
    flex: 1;
    flex-direction: column;
    align-items: center;
`;

export const InformationContainer = styled.div`
    display: inline-flex;
    margin: calc(var(--grid-unit)*2) 0px;
    min-width: 390px;
    flex-direction: column;
    background-color: ${tokens.colors.ui.background__default.rgba};
    padding: calc(var(--grid-unit)*2) calc(var(--grid-unit)*4);
    .inputRow {
        display: flex;
        flex-direction: row;
        margin-top: calc(var(--grid-unit)*2)
    }
`;

export const TabBar = styled.div`
    display: flex;
    justify-content: flex-start;
    padding: var(--grid-unit)  0px ;
`;

interface TabBarButtonProps {
    current?: boolean;
    disabled?: boolean;
}
export const TabBarButton = styled.div<TabBarButtonProps>`
    border-bottom: 2px solid ${tokens.colors.ui.background__medium.rgba};
    display:flex;
    justify-content: center;
    align-items: center;
    padding: var(--grid-unit) calc(var(--grid-unit)*2);
    ${({current}): any => current && css`
        color: ${tokens.colors.interactive.primary__resting.rgba};;
        border-color: ${tokens.colors.interactive.primary__resting.rgba};
    `}
    ${({disabled}): any => disabled && css`
        color: ${tokens.colors.interactive.disabled__text.rgba};
    `}
`;
export const TabBarFiller = styled.div`
    display: flex;
    flex: 1;
    border-bottom: 2px solid ${tokens.colors.ui.background__medium.rgba};

`;
