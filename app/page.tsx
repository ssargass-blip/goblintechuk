import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { HomeClient } from './HomeClient';
import type { Deal } from './types';

async function loadInitialDeals(): Promise<Deal[]> {
  try {
    const dealsPath = path.join(process.cwd(), 'public', 'deals.json');
    const rawDeals = await readFile(dealsPath, 'utf8');
    const deals = JSON.parse(rawDeals);

    return Array.isArray(deals) ? deals : [];
  } catch (error) {
    console.error('Failed to load deals.json for SSR', error);
    return [];
  }
}

export default async function Home() {
  const initialDeals = await loadInitialDeals();

  return <HomeClient initialDeals={initialDeals} />;
}
