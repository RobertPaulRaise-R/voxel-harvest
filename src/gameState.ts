export const gameState = {
  time: 0, // "30 mins is one day"
  isDay: time <= 15,
  season: "spring",
  weather: {
    current: "clear", // "clear", "sunny", "rainy", "snowy",
    temperature: 20,
    precipitation: 0,
  },

  grid: [
    [
      { type: "grass", state: "empty", water: 0 }, // type: "grass", "road", "path"
      { type: "road", state: "empty", water: 0 }, // state: "soil", "dirt", "fertile",
    ], // Example grid
  ],
  crop: 0, // 0 1 2 4    4 Stages of crop growing

  player: {
    player1: {
      position: { x: 0, y: 0 },
      money: 10000,
      maxWeight: 50, // Max weight the player can carry
      currentWeight: 0, // Updates dynamically
      inventory: [
        { id: "wheat_seed", quantity: 10, weight: 0.2 },
        { id: "watering_can", quantity: 1, weight: 2.0 },
        { id: "fertilizer", quantity: 5, weight: 1 },
      ],
    },
  },
};
