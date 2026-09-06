import { useState, useEffect } from 'react';
import api from '../api';
import ProductsTable from '../components/ProductsTable';
import ShipmentsTable from '../components/ShipmentsTable';
import AddProductModal from '../components/AddProductModal';
import CreateShipmentModal from '../components/CreateShipmentModal';

function Dashboard() {
  const user = JSON.parse(localStorage.getItem('user'));
  const [activeView, setActiveView] = useState('products'); // 'products' | 'shipments'
  const [products, setProducts] = useState([]);
  const [shipments, setShipments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [showCreateShipment, setShowCreateShipment] = useState(false);
  const canEdit = user?.role === 'admin' || user?.role === 'manager';

  const loadData = async () => {
    setLoading(true);
    try {
      const [productsRes, shipmentsRes] = await Promise.all([
        api.get('/products'),
        api.get('/shipments'),
      ]);
      setProducts(productsRes.data);
      setShipments(shipmentsRes.data);
    } catch (err) {
      console.error('Failed to load data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  const lowStockCount = products.filter((p) => p.quantity < 10).length;
  const pendingShipments = shipments.filter((s) => s.status === 'pending').length;

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-56 bg-slate-900 text-white flex flex-col shrink-0">
        <div className="px-5 py-5 flex items-center gap-2 border-b border-white/10">
          <div className="w-8 h-8 rounded bg-white/10 flex items-center justify-center font-semibold text-sm">
            W
          </div>
          <span className="font-semibold text-sm">Ops Portal</span>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1">
          <button
            onClick={() => setActiveView('products')}
            className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              activeView === 'products' ? 'bg-white/10 text-white' : 'text-gray-300 hover:bg-white/5'
            }`}
          >
            Products
          </button>
          <button
            onClick={() => setActiveView('shipments')}
            className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              activeView === 'shipments' ? 'bg-white/10 text-white' : 'text-gray-300 hover:bg-white/5'
            }`}
          >
            Shipments
          </button>
        </nav>

        <div className="px-4 py-4 border-t border-white/10">
          <p className="text-sm font-medium">{user?.name}</p>
          <p className="text-xs text-gray-400 capitalize mb-3">{user?.role}</p>
          <button
            onClick={handleLogout}
            className="text-xs text-gray-400 hover:text-white transition-colors"
          >
            Sign out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 bg-[#F4F6F8] p-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-lg font-semibold text-gray-900 capitalize">{activeView}</h1>
          {canEdit && activeView === 'products' && (
            <button
              onClick={() => setShowAddProduct(true)}
              className="px-3 py-1.5 text-sm bg-slate-900 text-white rounded-md hover:bg-[#16212D]"
            >
              + Add product
            </button>
          )}
          {canEdit && activeView === 'shipments' && (
            <button
              onClick={() => setShowCreateShipment(true)}
              className="px-3 py-1.5 text-sm bg-slate-900 text-white rounded-md hover:bg-[#16212D]"
            >
              + Create shipment
            </button>
          )}
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-lg border border-gray-200 p-5">
            <p className="text-xs text-gray-500 mb-1">Total products</p>
            <p className="text-2xl font-semibold text-gray-900">{products.length}</p>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-5">
            <p className="text-xs text-gray-500 mb-1">Low stock (below 10)</p>
            <p className="text-2xl font-semibold text-danger">{lowStockCount}</p>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-5">
            <p className="text-xs text-gray-500 mb-1">Pending shipments</p>
            <p className="text-2xl font-semibold text-warning">{pendingShipments}</p>
          </div>
        </div>

        {loading ? (
          <p className="text-sm text-gray-500">Loading...</p>
        ) : activeView === 'products' ? (
          <ProductsTable products={products} userRole={user?.role} onRefresh={loadData} />
        ) : (
          <ShipmentsTable shipments={shipments} userRole={user?.role} onRefresh={loadData} />
        )}

        {showAddProduct && (
          <AddProductModal onClose={() => setShowAddProduct(false)} onSuccess={loadData} />
        )}
        {showCreateShipment && (
          <CreateShipmentModal
            products={products}
            onClose={() => setShowCreateShipment(false)}
            onSuccess={loadData}
          />
        )}
      </main>
    </div>
  );
}

export default Dashboard;