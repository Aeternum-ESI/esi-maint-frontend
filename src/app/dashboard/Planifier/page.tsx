import { $fetch } from '@/app/fetch';
import { getToken } from '@/app/getToken';
import { Asset, Category } from '@/lib/types';
import { CalendarWrapper } from './components/CalendarWrapper';

async function PlanifierPage() {
  const [assetsResponse, categoriesResponse] = await Promise.all([
    $fetch("/assets", { auth: await getToken() }),
    $fetch("/categories", { auth: await getToken() })
  ]);

  const assets: Asset[] = assetsResponse.data?.data || [];
  const categories: Category[] = categoriesResponse.data?.data || [];

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Planification de tâche préventive</h1>
      <CalendarWrapper assets={assets} categories={categories} />
    </div>
  );
}

export default PlanifierPage;