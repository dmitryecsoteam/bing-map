const Destination = {
    findById: (id) => ({ 
        select: () => {
            switch (id) {
                case 1: return Promise.resolve({ _id: 1, latitude: '111.11111', longitude: '111.11111', nameEn: 'First Destination' });
                case 2: return Promise.resolve({ _id: 2, latitude: '222.22222', longitude: '-222.22222', nameEn: 'Second Destination' });
                case 3: return Promise.resolve({ _id: 3, latitude: '333.33333', longitude: '333.33333', nameEn: 'Third Destination' });
                case 4: return Promise.resolve({ _id: 4, latitude: '444.44444', longitude: '-444.44444', nameEn: 'Fourh Destination' });
            }
            }
    })
};

module.exports = Destination;