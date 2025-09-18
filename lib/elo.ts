export type EloInput = {
  ra: number;
  rb: number;
  gamesA: number;
  gamesB: number;
};

export type EloOutput = {
  raNew: number;
  rbNew: number;
  dynamicPointsA: number;
  dynamicPointsB: number;
};

// Bradley-Terry model implementation
export function updateElo({ ra, rb, gamesA, gamesB }: EloInput): EloOutput {
  // Calculate Bradley-Terry probabilities
  const strengthA = Math.pow(10, ra / 400);
  const strengthB = Math.pow(10, rb / 400);
  const totalStrength = strengthA + strengthB;
  
  const pA = strengthA / totalStrength; // P(A beats B)
  const pB = strengthB / totalStrength; // P(B beats A)

  // Calculate actual score based on games won
  const totalGames = gamesA + gamesB;
  const sa = gamesA / totalGames; // Actual score for A
  const sb = gamesB / totalGames; // Actual score for B

  // Update ratings using Bradley-Terry model
  const K = 16; // Learning rate
  const ratingChangeA = Math.round(K * (sa - pA));
  const ratingChangeB = Math.round(K * (sb - pB));

  // Calculate dynamic points based on Bradley-Terry probabilities
  let dynamicPointsA = 0;
  let dynamicPointsB = 0;

  if (gamesA > gamesB) {
    // A won - points = 1 / P(A beats B)
    dynamicPointsA = 1 / pA;
  } else {
    // B won - points = 1 / P(B beats A)
    dynamicPointsB = 1 / pB;
  }

  return {
    raNew: ra + ratingChangeA,
    rbNew: rb + ratingChangeB,
    dynamicPointsA,
    dynamicPointsB,
  };
}