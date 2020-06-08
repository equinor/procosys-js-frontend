import '@testing-library/jest-dom/extend-expect';
jest.mock('./settings.json', () => {
    const settingsTemplate = require('./settings.template.json');
    return settingsTemplate;
});
