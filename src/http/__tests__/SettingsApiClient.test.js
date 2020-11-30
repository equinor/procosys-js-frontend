import SettingsApiClient from '@procosys/http/SettingsApiClient';
import axios from 'axios';

jest.mock('axios');

jest.mock('../../settings.json', () => ({
    clientId: 'test'
}));

const serverResponse = {
    data: {
        clientId: 'my-client-id',
        authority: 'my-authority'
    }
};


describe('SettingsApiClient', async () => {

    it ('Should not alter remote response when no local override is given', async () => {
        axios.get.mockResolvedValue({...serverResponse});

        const settingsApiClient = new SettingsApiClient();
        const result = await settingsApiClient.getConfig();
        expect(result.authority).not.toBe(serverResponse.data.authority);
    });

    it ('Should alter remote response when local override is given', async () => {
        axios.get.mockResolvedValue({...serverResponse});

        const settingsApiClient = new SettingsApiClient();
        const result = await settingsApiClient.getConfig();
        expect(result.clientId).toBe('test');
    });
    
});
