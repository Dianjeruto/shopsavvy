import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { demoCollections, demoProducts } from '@/lib/demo-catalog';
import { Truck, ShieldCheck, RefreshCw, Headphones } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Newsletter from '@/components/Newsletter';
import ProductCard from '@/components/ProductCard';

const HERO = 'https://d64gsuwffb70l.cloudfront.net/6a2502df6d2d5ba36acdc0a1_1780810805370_ff5ef0c2.png';

const Home: React.FC = () => {
  const [featured, setFeatured] = useState<any[]>([]);
  const [collections, setCollections] = useState<any[]>([]);

  useEffect(() => {
    const loadFeatured = async () => {
      try {
        const { data, error } = await supabase.from('ecom_products').select('*, variants:ecom_product_variants(*)').eq('status', 'active').contains('tags', ['featured']).limit(8);
        if (error || !data?.length) {
          setFeatured(demoProducts.filter((product) => (product.tags || []).includes('featured')).slice(0, 4));
        } else {
          setFeatured(data);
        }
      } catch {
        setFeatured(demoProducts.filter((product) => (product.tags || []).includes('featured')).slice(0, 4));
      }
    };

    const loadCollections = async () => {
      try {
        const { data, error } = await supabase.from('ecom_collections').select('*').eq('is_visible', true).neq('handle', 'new-arrivals').neq('handle', 'sale').order('sort_order').limit(6);
        if (error || !data?.length) {
          setCollections(demoCollections.slice(2, 6));
        } else {
          setCollections(data);
        }
      } catch {
        setCollections(demoCollections.slice(2, 6));
      }
    };

    loadFeatured();
    loadCollections();
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <section className="bg-[#2C2C2C] text-white overflow-hidden border-b border-white/10">
        <div className="offer-marquee flex min-w-max items-center gap-10 py-3 text-sm font-semibold tracking-wide uppercase">
          <span>Flash Offer • Save up to 30% on selected picks</span>
          <span>Free delivery on orders above KSh 3,000</span>
          <span>New season arrivals now live</span>
          <span>Flash Offer • Save up to 30% on selected picks</span>
          <span>Free delivery on orders above KSh 3,000</span>
          <span>New season arrivals now live</span>
        </div>
      </section>

      {/* Hero */}
      <section className="relative h-[60vh] min-h-[420px] md:min-h-[500px] flex items-center overflow-hidden">
        <img src={HERO} alt="Shop" className="absolute inset-0 w-full h-full object-cover animate-hero-pan" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/45 to-transparent" />
        <div className="relative max-w-7xl mx-auto px-4 w-full">
          <div className="max-w-lg text-white home-hero-card">
            <p className="text-[#FF6B6B] font-semibold mb-3 tracking-wide text-sm sm:text-base">NEW SEASON · 2026</p>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight mb-4">Elevate Your Everyday</h1>
            <p className="text-base sm:text-lg opacity-90 mb-8 max-w-md">Discover 50+ curated products across electronics, fashion, home, beauty and more — all with free shipping.</p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <Link to="/products" className="bg-[#FF6B6B] text-white px-6 sm:px-8 py-3.5 rounded-lg font-semibold hover:bg-[#ff5252] transition-all duration-300 hover:-translate-y-0.5 text-center">Shop Now</Link>
              <Link to="/collections/new-arrivals" className="bg-white text-[#2C2C2C] px-6 sm:px-8 py-3.5 rounded-lg font-semibold hover:bg-gray-100 transition-all duration-300 hover:-translate-y-0.5 text-center">New Arrivals</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Perks */}
      <section className="border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {[
            { icon: Truck, t: 'Free Shipping', s: 'On all orders' },
            { icon: RefreshCw, t: 'Easy Returns', s: '30-day policy' },
            { icon: ShieldCheck, t: 'Secure Payment', s: 'Encrypted checkout' },
            { icon: Headphones, t: '24/7 Support', s: 'Always here to help' }
          ].map((p, i) => (
            <div key={i} className="flex items-center gap-3 rounded-xl border border-gray-100 bg-white/70 p-3 shadow-sm home-perk-card">
              <p.icon className="text-[#FF6B6B] shrink-0" size={28} />
              <div className="min-w-0">
                <p className="font-semibold text-gray-900 text-sm">{p.t}</p>
                <p className="text-xs text-gray-500">{p.s}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Collections */}
      <section className="max-w-7xl mx-auto px-4 py-14">
        <h2 className="text-2xl sm:text-3xl font-bold text-center mb-2">Shop by Category</h2>
        <p className="text-center text-gray-500 mb-10">Find exactly what you're looking for</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {collections.map((c, index) => (
            <Link key={c.id} to={`/collections/${c.handle}`}
              style={{ animationDelay: `${index * 80}ms` }}
              className="relative bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl p-6 sm:p-8 h-40 sm:h-44 flex flex-col justify-end hover:shadow-lg transition-all duration-300 group overflow-hidden home-collection-card">
              <div className="absolute inset-0 bg-[#FF6B6B]/0 group-hover:bg-[#FF6B6B]/5 transition-colors" />
              <h3 className="text-lg sm:text-xl font-bold text-[#2C2C2C] relative">{c.title}</h3>
              <p className="text-sm text-gray-600 relative">{c.description}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured */}
      <section className="max-w-7xl mx-auto px-4 pb-14">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold">Featured Products</h2>
            <p className="text-gray-500">Handpicked favorites just for you</p>
          </div>
          <Link to="/products" className="text-[#FF6B6B] font-semibold hover:underline self-start sm:self-auto">View All →</Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {featured.map((p, index) => (
            <div key={p.id} style={{ animationDelay: `${index * 80}ms` }} className="home-product-card">
              <ProductCard product={p} />
            </div>
          ))}
        </div>
      </section>

      <Newsletter />
      <Footer />
    </div>
  );
};

export default Home;
