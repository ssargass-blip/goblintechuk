import { HomeClient } from './HomeClient';
import { loadDeals } from './lib/deal-data';

export default async function Home() {
  const initialDeals = await loadDeals();

  return <HomeClient initialDeals={initialDeals} />;
}
