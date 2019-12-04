import CacheService from '../CacheService';

describe('Caching Service', () => {

    const service = new CacheService('Testing');
    beforeEach(() => sessionStorage.clear());
    const storedData = {hello: 'world'};


    it('Should store data to cache', () => {
        service.setCache('dataset_1', storedData);
        const retrievedData = sessionStorage.getItem('Testing:dataset_1');
        const parsedData = JSON.parse(retrievedData);
        expect(parsedData.data).toEqual(storedData);
    });

    it('Should get cached data', () => {
        service.setCache('dataset_2', storedData);
        const retrievedData = service.getCache('dataset_2');
        expect(retrievedData.data).toEqual(storedData);
        expect(retrievedData.cachedAt).toBeInstanceOf(Date);
    });

    it('Should handle spaces in key', () => {
        service.setCache('dataset 3', storedData);
        const retrievedData = service.getCache('dataset 3');
        expect(retrievedData.data).toEqual(storedData);
        expect(retrievedData.cachedAt).toBeInstanceOf(Date);
    });

    it('Should delete all entries for current service', () => {
        service.setCache('dataset 4', storedData);
        service.clear();
        const retrievedData = service.getCache('dataset 3');
        expect(retrievedData).toBeNull();
    });

    it('Should not delete entries for other services', () => {
        const starWarsCacheService = new CacheService('StarWars');
        starWarsCacheService.setCache('data1', storedData);

        service.setCache('dataset5', storedData);
        service.clear();
        const retrievedData = starWarsCacheService.getCache('data1');
        expect(retrievedData).not.toBeNull();
    });
});
