const Origin = {
    findById: () => ({ 
        select: () => Promise.resolve({ _id: 1, latitude: '000', longitude: '000', nameEn: 'OriginName' })
    })
};

module.exports = Origin;