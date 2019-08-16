const axios = {
    get: jest.fn((url) => {
        if (url.includes('22222')) {
            return Promise.reject({
                response: {
                    data: {
                        errorDetails: ['One or more waypoints can\'t be routed because they are too far from any roads.']
                    }
                }
            });
        } else if (url.includes('33333')) {
            return Promise.reject({
                response: {
                    data: {
                        errorDetails: ['Unknown error']
                    }
                }
            });
        } else {
            return Promise.resolve({
                data: {
                    resourceSets: [
                        {
                            resources: [
                                {
                                    routeLegs: [
                                        {
                                            travelDistance: 512.308,
                                            travelDuration: 24779
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                }
            });
        }
    })
};

module.exports = axios;