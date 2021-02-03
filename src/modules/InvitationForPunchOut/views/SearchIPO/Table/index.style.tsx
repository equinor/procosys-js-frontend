import { Breakpoints } from '@procosys/core/styling';
import styled from 'styled-components';
import { tokens } from '@equinor/eds-tokens';

export const Container = styled.div`
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
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
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
