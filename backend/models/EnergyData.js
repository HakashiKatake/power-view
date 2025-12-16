const mongoose = require('mongoose');

const EnergyDataSchema = new mongoose.Schema({
    timestamp: {
        type: Date,
        default: Date.now,
        index: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    consumptionKwh: {
        type: Number,
        required: true
    },
    cost: {
        type: Number,
        required: true
    },
    voltage: {
        type: Number,
        default: 230
    }
}, {
    timeseries: {
        timeField: 'timestamp',
        metaField: 'user',
        granularity: 'seconds'
    }
});

module.exports = mongoose.model('EnergyData', EnergyDataSchema);
