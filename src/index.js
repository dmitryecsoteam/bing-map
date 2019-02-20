const mongo = require('./server/mongo');
const Travel = require('./models/Travel');
const Origin = require('./models/Origin');
const Destination = require('./models/Destination');

const axios = require('axios');

const generateURL = (originLat, originLong, destLat, destLong) => {
    return process.env.BASE_URL + 'origins=' + originLat + ',' + originLong + '&destinations=' + destLat + ',' + destLong + '&key=' + process.env.KEY;
}


const run = async () => {
    // Connect to mongo DB
    await mongo.connect();

    // Find max origin ID
    const originID = await Travel.findMaxOrigin();

    // Find max destination ID
    const destID = await Travel.findMaxDestination();


    for (let originIndex = 1; originIndex <= originID.origin; originIndex++) {
        const origin = await Origin.findById(originIndex);

        for (let destIndex = 1; destIndex <= destID.destination; destIndex++) {
            const destination = await Destination.findById(destIndex);

            // Find any travel for specific origin and destination
            // If carDistance is undefined then send request to bing map API and save new data
            const { carDistance } = await Travel.findRandomTravel(originIndex, destIndex);
            if (carDistance === undefined) {

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





    await mongo.close();
};

run().catch(error => console.error(error.stack));