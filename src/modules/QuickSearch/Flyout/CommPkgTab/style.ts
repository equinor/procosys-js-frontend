import { Card } from "@equinor/eds-core-react";
import { Divider } from "@equinor/eds-core-react";
import styled from "styled-components";
import { tokens } from '@equinor/eds-tokens';

export const Container = styled.div`
    display: flex;
    width: 100%;
    flex-wrap: wrap;
`;

export const StyledCard50 = styled(Card)`
    flex: 1 1 50%;
`;

export const StyledCard100 = styled(Card)`
    flex: 1 1 100%;
`;

export const MCPackageEntry = styled.div`
    display: flex;
    flex-direction: column;
    flex: 1 1 100%;
    width: 100%;
`;

export const StyledDivider = styled(Divider)`
    width: 100%;
`;

export const StyledHeaderTitleLink = styled(Card.HeaderTitle)`
    > p {
        display: flex;
        align-items: center;
        color: ${tokens.colors.interactive.primary__resting.rgba};
    }
    
    p > span:last-child {
            margin-top: -6px;
            margin-left: 5px;
        }
    
    mark {
        background-color: ${tokens.colors.infographic.primary__moss_green_21.rgba};
    }
`;

export const StyledHeaderTitle = styled(Card.HeaderTitle)`  
    mark {
        background-color: ${tokens.colors.infographic.primary__moss_green_21.rgba};
    }
`;

export const StyledCardHeader = styled(Card.Header)`
    cursor: pointer;
    :hover * {
        font-weight: 500;
    }
`;

export const LoadingDiv = styled.div`
    text-align: center;
    width: 100%;
`;
