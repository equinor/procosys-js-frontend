import styled from "styled-components";

export const MainContainer = styled.div`
    height: 70vh;
`;

export const TableContainer = styled.div<{ isHalfSize: boolean }>`
    height: ${(props): string => props.isHalfSize? '50%' : '100%' };
`;