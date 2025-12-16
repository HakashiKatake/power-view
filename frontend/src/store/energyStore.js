import { create } from 'zustand';
import { io } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';

export const useEnergyStore = create((set, get) => ({
    socket: null,
    currReading: { consumptionKwh: 0, cost: 0, voltage: 0 },
    history: [], // Array of readings for chart
    isConnected: false,
    budgetExceeded: false,

    connectSocket: (userId) => {
        if (get().socket) return;
        if (!userId) return; // Need user ID to filter events

        // Fetch initial history
        fetch(`${SOCKET_URL}/api/energy/history`, {
            headers: { 'x-auth-token': localStorage.getItem('token') }
        })
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) {
                    set({ history: data });
                    // Set current reading to last history item if exists
                    if (data.length > 0) {
                        const last = data[data.length - 1];
                        set({ currReading: { consumptionKwh: last.consumptionKwh, cost: last.cost, voltage: last.voltage } });
                    }
                }
            })
            .catch(err => console.error("Failed to fetch history:", err));

        const socket = io(SOCKET_URL);

        socket.on('connect', () => {
            set({ isConnected: true });
            console.log('Socket connected');
        });

        socket.on('disconnect', () => {
            set({ isConnected: false });
        });

        socket.on('energy-update', (data) => {
            // Filter: Only process data for this user
            if (data.userId && data.userId !== userId) return;

            const { consumptionKwh, cost, voltage, timestamp } = data;

            // Update current reading and add to history (keep last 50 points)
            set((state) => {
                const newHistory = [...state.history, { ...data, timestamp: new Date(timestamp) }].slice(-50);
                return {
                    currReading: { consumptionKwh, cost, voltage },
                    history: newHistory
                };
            });
        });

        set({ socket });
    },

    disconnectSocket: () => {
        const { socket } = get();
        if (socket) {
            socket.disconnect();
            set({ socket: null, isConnected: false });
        }
    }
}));
