const mongo = require('./server/mongo');
const Travel = require('./models/Travel');
const Origin = require('./models/Origin');
const Destination = require('./models/Destination');

const axios = require('axios');

const generateURL = (originLat, originLong, destLat, destLong) => {
    return process.env.BASE_URL + 'wp.0=' + originLat + ',' + originLong + '&wp.1=' + destLat + ',' + destLong + '&key=' + process.env.KEY;
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
            const origin = await Origin.findById(originIndex).select({ _id: 1, latitude: 1, longitude: 1, nameEn: 1 });

            // If origin with such ID exists
            if (origin) {
                for (let destIndex = 1; destIndex <= destID.destination; destIndex++) {
                    const destination = await Destination.findById(destIndex).select({ _id: 1, latitude: 1, longitude: 1, nameEn: 1 });

                    // If destination with such ID exists
                    if (destination) {
                        const existsWithoutCar = await Travel.existsWithoutCar(origin._id, destination._id);

                        // If exist at least one record without carDistance or carDuration for these origin and destination,
                        // Make request to API and update travels in DB
                        if (existsWithoutCar) {

                            const url = generateURL(origin.latitude, origin.longitude, destination.latitude, destination.longitude);

                            console.log('URL: ', url);

                            let carDistance, carDuration;

                            // Request API in try-catch block
                            try {
                                const response = await axios.get(url);

                                // If everything is OK, set distance and duration values from request
                                carDistance = Math.round(response.data.resourceSets[0].resources[0].routeLegs[0].travelDistance);
                                carDuration = Math.round(response.data.resourceSets[0].resources[0].routeLegs[0].travelDuration / 60);

                            } catch (e) {
                                if (e.response.data.errorDetails[0].includes('No route was found')) {
                                    // If no route was found set distance and duration to -1
                                    carDistance = -1;
                                    carDuration = -1;
                                } else {
                                    // If API returned any other error: log it and jump over next iteration in loop
                                    // without saving anything to DB
                                    console.log(e);
                                    continue;
                                }
                            }

                            console.log('Origin: ', originIndex, origin.nameEn);
                            console.log('Destination: ', destIndex, destination.nameEn);
                            console.log('carDistance:', carDistance);
                            console.log('carDuration:', carDuration);
                            console.log('-------------------------------');

                            // Save distance and duration to DB
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