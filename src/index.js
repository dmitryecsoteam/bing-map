const mongo = require('./server/mongo');
const Travel = require('./models/Travel');
const Origin = require('./models/Origin');
const Destination = require('./models/Destination');

const axios = require('axios');

const generateURL = (originLat, originLong, destLat, destLong) => {
    return process.env.BASE_URL + 'origins=' + originLat + ',' + originLong + '&destinations=' + destLat + ',' + destLong + '&key=' + process.env.KEY;
}


const run = async () => {

    try {
        // Connect to mongo DB
        await mongo.connect();

        // Find max origin ID
        const originID = await Travel.findMaxOrigin();

        // Find max destination ID
        const destID = await Travel.findMaxDestination();


        for (let originIndex = 1; originIndex <= originID.origin; originIndex++) {
            const origin = await Origin.findById(originIndex).select({ _id: 1, latitude: 1, longitude: 1 });

            if (origin) {
                for (let destIndex = 1; destIndex <= destID.destination; destIndex++) {
                    const destination = await Destination.findById(destIndex).select({ _id: 1, latitude: 1, longitude: 1 });

                    if (destination) {
                        const existsWithoutCar = await Travel.existsWithoutCar(origin._id, destination._id);

                        //console.log(existsWithoutCar, origin._id, destination._id);

                        if (existsWithoutCar) {

                            const url = generateURL(origin.latitude, origin.longitude, destination.latitude, destination.longitude);

                            console.log('OriginID: ', originIndex);
                            console.log('DestinationID: ', destIndex);
                            console.log('URL: ', url);

                            const response = await axios.get(url);
                            const carDistance = response.data.resourceSets[0].resources[0].results[0].travelDistance;
                            const carDuration = response.data.resourceSets[0].resources[0].results[0].travelDuration;

                            await Travel.updateMany({ origin: originIndex, destination: destIndex }, { $set: { carDistance, carDuration } });

                        }


                    }
                }
            }
        }




    } catch (e) {
        console.log(e);
    } finally {
        await mongo.close();
    }
};

run();