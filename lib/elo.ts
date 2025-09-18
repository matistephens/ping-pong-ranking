export type EloInput = {
  ra: number;
  rb: number;
  gamesA: number;
  gamesB: number;
};

export type EloOutput = {
  raNew: number;
  rbNew: number;
};

export function updateElo({ ra, rb, gamesA, gamesB }: EloInput): EloOutput {
  const ka = 24; // symmetric
  const mov = Math.log(1 + Math.abs(gamesA - gamesB));
  const sa = gamesA > gamesB ? 1 : (gamesA === gamesB ? 0.5 : 0);
  const ea = 1 / (1 + Math.pow(10, (rb - ra)/400));
  const delta = Math.round(ka * mov * (sa - ea));
  return { raNew: ra + delta, rbNew: rb - delta };
}
