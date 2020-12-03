import styled from 'styled-components';

export const ProCoSysRootLayout = styled.div`
    display: flex;
    flex-direction: column;
    //max-height: calc(100vh);
    overflow-y: auto;
    min-height: 100vh;
    min-height: -webkit-fill-available;
    height: fill-available;

    #root-content {
        overflow: auto;
        height: 100%;
    }
    
    html {
        height: -webkit-fill-available;
        height: fill-available;
    }
`;
