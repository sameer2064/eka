export function calculateAIScore(
  provider: any
) {

  const rating =
    Number(
      provider.average_rating || 0
    ) * 25;

  const views =
    Number(
      provider.total_views || 0
    ) * 0.05;

  const bookings =
    Number(
      provider.total_bookings ||
        0
    ) * 3;

  const premium =
    provider.premium ? 40 : 0;

  const verified =
    provider.verified ? 50 : 0;

  const trust =
    Number(
      provider.trust_score || 0
    );

  const completion =
    Number(
      provider.completion_rate ||
        0
    ) * 2;

  const score =
    rating +
    views +
    bookings +
    premium +
    verified +
    trust +
    completion;

  return Math.round(score);
}