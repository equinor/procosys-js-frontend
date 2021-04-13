import { Breakpoints } from '@procosys/core/styling';
import styled from 'styled-components';

export const Toolbar = styled.div`
    margin-top: calc(var(--grid-unit) * 2);
    margin-bottom: var(--grid-unit);
`;

export const Container = styled.div`
    height: 100%;
    
    ${Breakpoints.TABLET} {
        //hide columns
        thead tr th:nth-child(2), table tr td:nth-child(2) //description
        {
            display: none;            
        } 
    }

`;
