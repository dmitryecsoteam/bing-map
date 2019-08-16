const updateCarInfo = require('../updateCarInfo');
const mockAxios = require('./__mocks__/axios');
const mongo = require('../server/mongo');
const Travel = require('../models/Travel');

jest.mock('../server/mongo.js');
jest.mock('../models/Destination.js');
jest.mock('../models/Origin.js');
jest.mock('../models/Travel.js');


test('should update DB', async () => {
    await updateCarInfo();

    // Open and close connection to DB
    expect(mongo.connect).toHaveBeenCalledTimes(1);
    expect(mongo.close).toHaveBeenCalledTimes(1);

    // Request API for two times. The last request should be made to destination with 444.44444
    expect(mockAxios.get).toHaveBeenCalledTimes(3);
    expect(mockAxios.get).toHaveBeenLastCalledWith('http://dev.virtualearth.net/REST/V1/Routes/Driving?wp.0=000,000&wp.1=444.44444,-444.44444&key=mytestkey')

    // Update to DB should be made two times
    expect(Travel.updateMany).toHaveBeenCalledTimes(2);
    expect(Travel.updateMany).toHaveBeenCalledWith({ origin: 1, destination: 2 }, { $set: { carDistance: -1, carDuration: -1 }});
    expect(Travel.updateMany).toHaveBeenCalledWith({ origin: 1, destination: 4 }, { $set: { carDistance: 512, carDuration: 413 }});
});
