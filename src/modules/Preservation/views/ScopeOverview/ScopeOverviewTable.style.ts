import styled from 'styled-components';
import { tokens } from '@equinor/eds-tokens';
import { Breakpoints } from '@procosys/core/styling';

export const Toolbar = styled.div`
    margin-top: calc(var(--grid-unit) * 2);
    margin-bottom: var(--grid-unit);
`;

export const TagStatusLabel = styled.span`
    margin-left: 10px;
    border-radius: calc(var(--grid-unit) * 2);
    padding: calc(var(--grid-unit) / 2) var(--grid-unit);
    font-size: calc(var(--grid-unit) * 1.5);
    background: ${tokens.colors.interactive.primary__selected_highlight.rgba};
    color: ${tokens.colors.interactive.primary__resting.rgba};
`;

export const TagLink = styled.span<{ isOverdue: boolean; isVoided: boolean }>`
    display: block;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    color: ${(props): string => props.isVoided ?
        '' :
        props.isOverdue
            ? tokens.colors.interactive.danger__text.rgba
            : tokens.colors.interactive.primary__resting.rgba};
    span { color: ${(props): string => props.isVoided ?
        '' :
        props.isOverdue
            ? tokens.colors.interactive.danger__text.rgba
            : tokens.colors.interactive.primary__resting.rgba};
    }
    text-decoration: underline;
    cursor: pointer;
`;

export const Container = styled.div`
    display: flex;
    flex-grow: 1;
    flex-direction: column;

    max-height: calc(100% - 160px);
        ${Breakpoints.TABLET} {
            margin-bottom: 60px;
            max-height: calc(100% - 140px);
        }
        ${Breakpoints.MOBILE} {
            max-height: calc(100% - 100px);
            margin-bottom: 60px;
        }
    
    input + svg {
        width: 24px;
        height: 24px;       
    }
    
    tbody, thead {
        .MuiButtonBase-root {
            :hover {
                background-color:  ${tokens.colors.interactive.primary__hover_alt.rgba};
            }
            > .MuiIconButton-label > svg {
                fill: ${tokens.colors.interactive.primary__resting.rgba};
            }
        }

        .MuiCheckbox-colorSecondary.Mui-checked:hover {
            background-color:  ${tokens.colors.interactive.primary__hover_alt.rgba};
        }

        .MuiTouchRipple-root {
            display: none;
        }
    }

    .controlOverflow {
        white-space: pre-wrap;
        color: inherit;
    }
    
    //Hide requirement column in the middle
    thead tr th:nth-child(4), table tr td:nth-child(4)
    { 
        display:none;
    }   
    
    ${Breakpoints.TABLET} {
        //hide columns
        thead tr th:nth-child(3), table tr td:nth-child(3) //description
        {
            display: none;            
        } 
        //Show requirement column in the middle
        thead tr th:nth-child(4), table tr td:nth-child(4)
        {   
            display:table-cell;
        }        
        //Hide requirement column at the end
        thead tr th:nth-child(13), table tr td:nth-child(13)
        {   
            display:none;
        }               
    }

`;

export const SingleIconContainer = styled.div`
    margin-bottom: calc(var(--grid-unit) * -1); /* centers the icon vertically and prevents the row height from expanding */
`;