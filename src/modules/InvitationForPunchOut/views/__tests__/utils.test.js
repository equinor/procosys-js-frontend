import { getFileExtension, getFileName } from '../utils';

describe('Common IPO utilities', () => {
    it('Function getFileName should return filename without extension', async () => {
        const fullFileName1 = 'textfile.txt';
        const fullFileName2 = 'textfile.txt.doc';
        const fullFileName3 = 'textfile 1';

        const fileName1 = getFileName(fullFileName1);
        const fileName2 = getFileName(fullFileName2);
        const fileName3 = getFileName(fullFileName3);

        expect(fileName1).toBe('textfile');
        expect(fileName2).toBe('textfile.txt');
        expect(fileName3).toBe('textfile 1');
    });

    it('Function getFileExtension should return file extension', async () => {
        const fullFileName1 = 'textfile.txt';
        const fullFileName2 = 'textfile.txt.doc';
        const fullFileName3 = 'textfile 1';

        const fileExt1 = getFileExtension(fullFileName1);
        const fileExt2 = getFileExtension(fullFileName2);
        const fileExt3 = getFileExtension(fullFileName3);

        expect(fileExt1).toBe('txt');
        expect(fileExt2).toBe('doc');
        expect(fileExt3).toBe('');
    });
});
