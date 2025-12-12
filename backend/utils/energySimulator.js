const EnergyData = require('../models/EnergyData');

/**
 * Simulates energy consumption data.
 * Returns an object with { consumptionKwh, cost, voltage }
 */
const generateReading = () => {
    // Basic simulation: fluctuating around 0.5 - 2.5 kW instantaneous draw
    // In a real app complexity would be higher (time of day patterns)

    // Random base baseLoad between 0.3 and 0.8 kW
    const baseLoad = 0.3 + Math.random() * 0.5;

    // Add some random spikes (appliances turning on)
    const spike = Math.random() > 0.8 ? Math.random() * 2.0 : 0;

    const kwh = baseLoad + spike; // This is actually kW (instantaneous power)
    // For 'consumption' over a small interval (e.g. 5s), we'd divide, but for gauge we show kW.

    // Let's say we assume a cost of $0.15 per kWh
    const costRate = kwh * 0.15;

    const voltage = 220 + (Math.random() * 10 - 5); // 215 - 225 V

    return {
        consumptionKwh: parseFloat(kwh.toFixed(3)), // Current Draw in kW
        cost: parseFloat(costRate.toFixed(4)), // Cost per Hour rate
        voltage: parseFloat(voltage.toFixed(1))
    };
};

const startSimulation = (io) => {
    console.log('Starting Energy Simulation Stream...');

    setInterval(() => {
        const reading = generateReading();
        const timestamp = new Date();

        // Emit to all connected clients
        io.emit('energy-update', {
            ...reading,
            timestamp
        });

        // NOTE: In a production app, we might not save EVERY second to DB to save space,
        // maybe aggregate or save once every minute. 
        // For this demo, let's save every 10th reading or just don't save DB here automatically 
        // to avoid filling it up during development unless requested.
        // We will implement a separate "History Saver" if needed.

    }, 2000); // Update every 2 seconds
};

module.exports = { startSimulation, generateReading };
