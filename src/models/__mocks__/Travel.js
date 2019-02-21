const Travel = {
    findMaxOrigin: () => Promise.resolve({ origin: 1 }),
    findMaxDestination: () => Promise.resolve({ destination: 4 }),
    existsWithoutCar: (orig, dest) => {
        if (dest === 1) {
            return Promise.resolve()
        } else {
            return Promise.resolve({ _id: 1 })
        }
    },
    updateMany: jest.fn(() => Promise.resolve({}))
};

module.exports = Travel;
