/**
 * Bradley-Terry probability and rating calculations
 */

export interface BTPlayer {
  id: string;
  name: string;
  rating: number;
  wins: number;
  losses: number;
  dynamicPoints: number;
}

/**
 * Calculate probability that player i beats player j using Bradley-Terry model
 */
export function calculateWinProbability(ratingI: number, ratingJ: number): number {
  return ratingI / (ratingI + ratingJ);
}

/**
 * Calculate dynamic points for a match result
 */
export function calculateDynamicPoints(winnerRating: number, loserRating: number): number {
  const winProb = calculateWinProbability(winnerRating, loserRating);
  return 1 / winProb; // Rewards upsets more (lower probability = higher points)
}

/**
 * Update Bradley-Terry ratings after a match
 */
export function updateBTRatings(
  winnerRating: number,
  loserRating: number,
  K: number = 32
): { newWinnerRating: number; newLoserRating: number } {
  const expectedWinnerProb = calculateWinProbability(winnerRating, loserRating);
  const ratingChange = K * (1 - expectedWinnerProb);

  return {
    newWinnerRating: winnerRating + ratingChange,
    newLoserRating: loserRating - ratingChange,
  };
}

/**
 * Scale ratings to have mean = 1000
 */
export function normalizeRatings(players: BTPlayer[]): BTPlayer[] {
  if (players.length === 0) return players;

  const totalRating = players.reduce((sum, p) => sum + p.rating, 0);
  const meanRating = totalRating / players.length;
  const scaleFactor = 1000 / meanRating;

  return players.map(p => ({
    ...p,
    rating: p.rating * scaleFactor
  }));
}
