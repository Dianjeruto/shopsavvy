import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { ADMIN_DEMO_EMAIL, ADMIN_DEMO_PASSWORD, getDemoSession, signInDemo } from '@/lib/auth-demo';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const AdminDashboard: React.FC = () => {
  const [customers, setCustomers] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [adminEmail, setAdminEmail] = useState(ADMIN_DEMO_EMAIL);
  const [adminPassword, setAdminPassword] = useState(ADMIN_DEMO_PASSWORD);
  const [authError, setAuthError] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    const session = getDemoSession();
    const currentAdmin = session?.user?.email === ADMIN_DEMO_EMAIL;
    setIsAdmin(currentAdmin);

    if (currentAdmin) {
      loadDashboard();
    } else {
      setLoading(false);
    }
  }, []);

  const loadDashboard = async () => {
    setLoading(true);
    try {
      const [{ data: customerData }, { data: orderData }] = await Promise.all([
        supabase.from('ecom_customers').select('*').order('created_at', { ascending: false }).limit(25),
        supabase.from('ecom_orders').select('*').order('created_at', { ascending: false }).limit(25),
      ]);

      setCustomers(customerData || []);
      setOrders(orderData || []);
    } catch {
      setCustomers([]);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredCustomers = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();

    if (!term) return customers;

    return customers.filter((customer) => {
      const fullText = [customer.name, customer.email, customer.location, customer.contact]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();
      return fullText.includes(term);
    });
  }, [customers, searchTerm]);

  const filteredOrders = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();

    return orders.filter((order) => {
      const matchesStatus = statusFilter === 'all' || String(order.status).toLowerCase() === statusFilter;
      const relevantText = [
        order.id,
        order.customer_id,
        order.status,
        order.payment_method,
        order.location,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();
      const matchesSearch = !term || relevantText.includes(term);
      return matchesSearch && matchesStatus;
    });
  }, [orders, searchTerm, statusFilter]);

  const totalRevenue = useMemo(() => {
    return orders.reduce((sum, order) => sum + (Number(order.total || 0) || 0), 0);
  }, [orders]);

  const pendingOrders = useMemo(() => {
    return orders.filter((order) => String(order.status).toLowerCase() === 'pending').length;
  }, [orders]);

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');

    try {
      await signInDemo(adminEmail, adminPassword);
      setIsAdmin(true);
      await loadDashboard();
    } catch (error) {
      setAuthError((error as Error).message || 'Admin sign-in failed.');
    }
  };

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <Header />
        <main className="flex-1 max-w-md mx-auto px-4 py-16 w-full">
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <p className="text-sm uppercase tracking-[0.25em] text-[#FF6B6B]">Admin Access</p>
            <h1 className="mt-2 text-3xl font-bold text-[#2C2C2C]">Admin Dashboard</h1>
            <p className="mt-2 text-sm text-gray-500">Use the secure admin credentials to continue.</p>

            <form onSubmit={handleAdminLogin} className="mt-6 space-y-3">
              <input type="email" value={adminEmail} onChange={(e) => setAdminEmail(e.target.value)} className="w-full border border-gray-200 rounded-lg p-3" placeholder="Admin email" required />
              <input type="password" value={adminPassword} onChange={(e) => setAdminPassword(e.target.value)} className="w-full border border-gray-200 rounded-lg p-3" placeholder="Admin password" required />
              <button type="submit" className="w-full bg-[#2C2C2C] text-white rounded-lg py-3 font-semibold hover:bg-black">Open Admin Dashboard</button>
            </form>

            {authError && <p className="mt-3 text-sm text-[#FF6B6B]">{authError}</p>}
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />
      <main className="flex-1 max-w-7xl mx-auto px-4 py-10 w-full">
        <div className="flex items-center justify-between gap-3 mb-6 flex-wrap">
          <div>
            <p className="text-sm uppercase tracking-[0.25em] text-[#FF6B6B]">Admin</p>
            <h1 className="text-3xl font-bold">Customers & Orders</h1>
          </div>
          <Link to="/" className="rounded-lg bg-[#2C2C2C] px-4 py-2 text-sm font-semibold text-white hover:bg-black">
            Back Home
          </Link>
        </div>

        {loading ? (
          <p className="text-gray-500">Loading customer activity...</p>
        ) : (
          <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-3">
              <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
                <p className="text-sm text-gray-500">Total Customers</p>
                <p className="mt-2 text-2xl font-bold">{customers.length}</p>
              </div>
              <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
                <p className="text-sm text-gray-500">Total Orders</p>
                <p className="mt-2 text-2xl font-bold">{orders.length}</p>
              </div>
              <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
                <p className="text-sm text-gray-500">Orders Pending</p>
                <p className="mt-2 text-2xl font-bold">{pendingOrders}</p>
              </div>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="text-sm text-gray-500">Revenue Snapshot</p>
                  <p className="text-xl font-bold">KSh {(totalRevenue / 100).toFixed(2)}</p>
                </div>
                <div className="flex flex-col gap-2 md:flex-row">
                  <input
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="border border-gray-200 rounded-lg px-3 py-2 text-sm"
                    placeholder="Search customer or order"
                  />
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="border border-gray-200 rounded-lg px-3 py-2 text-sm"
                  >
                    <option value="all">All statuses</option>
                    <option value="pending">Pending</option>
                    <option value="paid">Paid</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="grid gap-6 xl:grid-cols-2">
              <section className="rounded-2xl border border-gray-200 p-5 bg-white shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold">Customers</h2>
                  <span className="text-sm text-gray-500">{filteredCustomers.length} shown</span>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-200 text-left text-gray-500">
                        <th className="pb-2 pr-4">Name</th>
                        <th className="pb-2 pr-4">Email</th>
                        <th className="pb-2 pr-4">Contact</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredCustomers.length === 0 ? (
                        <tr>
                          <td colSpan={3} className="py-3 text-gray-500">No customer records found.</td>
                        </tr>
                      ) : filteredCustomers.map((customer) => (
                        <tr key={customer.id} className="border-b border-gray-100 align-top">
                          <td className="py-3 pr-4 font-semibold">{customer.name || 'Unnamed customer'}</td>
                          <td className="py-3 pr-4 text-gray-600">{customer.email || 'n/a'}</td>
                          <td className="py-3 pr-4 text-gray-600">{customer.contact || 'n/a'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>

              <section className="rounded-2xl border border-gray-200 p-5 bg-white shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold">Orders</h2>
                  <span className="text-sm text-gray-500">{filteredOrders.length} shown</span>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-200 text-left text-gray-500">
                        <th className="pb-2 pr-4">Order</th>
                        <th className="pb-2 pr-4">Status</th>
                        <th className="pb-2 pr-4">Customer</th>
                        <th className="pb-2 pr-4">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredOrders.length === 0 ? (
                        <tr>
                          <td colSpan={4} className="py-3 text-gray-500">No orders found yet.</td>
                        </tr>
                      ) : filteredOrders.map((order) => (
                        <tr key={order.id} className="border-b border-gray-100 align-top">
                          <td className="py-3 pr-4 font-semibold">#{order.id?.slice(0, 8) || 'n/a'}</td>
                          <td className="py-3 pr-4">
                            <span className="rounded-full bg-[#FF6B6B]/10 text-[#FF6B6B] px-2 py-1 text-xs">{order.status || 'n/a'}</span>
                          </td>
                          <td className="py-3 pr-4 text-gray-600">{order.customer_id || 'n/a'}</td>
                          <td className="py-3 pr-4 text-gray-600">KSh {((order.total || 0) / 100).toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default AdminDashboard;
