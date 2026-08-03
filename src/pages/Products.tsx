import React, { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { demoProducts } from '@/lib/demo-catalog';
import { getMarketAdjustedPrice } from '@/lib/format';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';

const Products: React.FC = () => {
  const [params] = useSearchParams();
  const q = params.get('q') || '';
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [type, setType] = useState('All');
  const [sort, setSort] = useState('featured');
  const [minPrice, setMinPrice] = useState(750);
  const [maxPrice, setMaxPrice] = useState(5600);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase.from('ecom_products').select('*, variants:ecom_product_variants(*)').eq('status', 'active');
        if (error || !data?.length) {
          setProducts(demoProducts);
        } else {
          setProducts(data);
        }
      } catch {
        setProducts(demoProducts);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const types = useMemo(() => ['All', ...Array.from(new Set(products.map(p => p.product_type).filter(Boolean)))], [products]);

  const filtered = useMemo(() => {
    let list = products.filter(p => {
      const price = getMarketAdjustedPrice((p.has_variants && p.variants?.length ? p.variants[0].price : p.price), p.product_type) / 100;
      if (type !== 'All' && p.product_type !== type) return false;
      if (price < minPrice || price > maxPrice) return false;
      if (q && !p.name.toLowerCase().includes(q.toLowerCase()) && !(p.product_type || '').toLowerCase().includes(q.toLowerCase())) return false;
      return true;
    });
    const getP = (p: any) => getMarketAdjustedPrice((p.has_variants && p.variants?.length ? p.variants[0].price : p.price), p.product_type);
    if (sort === 'price-asc') list = [...list].sort((a, b) => getP(a) - getP(b));
    if (sort === 'price-desc') list = [...list].sort((a, b) => getP(b) - getP(a));
    if (sort === 'name') list = [...list].sort((a, b) => a.name.localeCompare(b.name));
    return list;
  }, [products, type, sort, minPrice, maxPrice, q]);

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between gap-3 mb-4 flex-wrap">
          <div>
            <h1 className="text-3xl font-bold mb-1">{q ? `Results for "${q}"` : 'All Products'}</h1>
            <p className="text-gray-500">{filtered.length} products</p>
          </div>
          <Link to="/" className="inline-flex items-center rounded-lg bg-[#FF6B6B] px-4 py-2 text-sm font-semibold text-white hover:bg-[#ff5252]">
            ← Back Home
          </Link>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters */}
          <aside className="lg:w-60 flex-shrink-0 space-y-6">
            <div>
              <h3 className="font-semibold mb-3">Category</h3>
              <div className="space-y-1">
                {types.map(t => (
                  <button key={t} onClick={() => setType(t)}
                    className={`block text-sm py-1 ${type === t ? 'text-[#FF6B6B] font-semibold' : 'text-gray-600 hover:text-gray-900'}`}>
                    {t}
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-3">
              <div>
                <h3 className="font-semibold mb-2">Price Range</h3>
                <p className="text-sm text-gray-600">KSh {minPrice} - KSh {maxPrice}</p>
              </div>
              <div className="space-y-2">
                <label className="block text-sm text-gray-700">
                  <span className="mb-1 block">Min Price</span>
                  <input type="range" min={750} max={5600} value={minPrice} onChange={e => {
                    const nextMin = Number(e.target.value);
                    setMinPrice(nextMin > maxPrice ? maxPrice : nextMin);
                  }} className="w-full accent-[#FF6B6B]" />
                </label>
                <label className="block text-sm text-gray-700">
                  <span className="mb-1 block">Max Price</span>
                  <input type="range" min={750} max={5600} value={maxPrice} onChange={e => {
                    const nextMax = Number(e.target.value);
                    setMaxPrice(nextMax < minPrice ? minPrice : nextMax);
                  }} className="w-full accent-[#FF6B6B]" />
                </label>
              </div>
            </div>
          </aside>

          {/* Grid */}
          <div className="flex-1">
            <div className="flex justify-end mb-4">
              <select value={sort} onChange={e => setSort(e.target.value)} className="border border-gray-200 rounded-lg px-3 py-2 text-sm">
                <option value="featured">Featured</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="name">Name A-Z</option>
              </select>
            </div>
            {loading ? (
              <p className="text-gray-500">Loading...</p>
            ) : filtered.length === 0 ? (
              <p className="text-gray-500">No products match your filters.</p>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5">
                {filtered.map(p => <ProductCard key={p.id} product={p} />)}
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Products;
