import styled from 'styled-components';

export const ProCoSysRootLayout = styled.div`
    display: flex;
    flex-direction: column;
    //max-height: calc(100vh);
    overflow-y: auto;
    height: 100vh;

    #root-content {
        overflow: auto;
        height: 100%;
    }   
`;
