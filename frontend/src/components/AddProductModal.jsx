import { useState } from 'react';
import api from '../api';

function AddProductModal({ onClose, onSuccess }) {
  const [form, setForm] = useState({ sku: '', name: '', quantity: '', warehouse_id: 1 });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await api.post('/products', {
        sku: form.sku,
        name: form.name,
        quantity: Number(form.quantity) || 0,
        warehouse_id: Number(form.warehouse_id),
      });
      onSuccess();
      onClose();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to add product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-sm p-6">
        <h2 className="text-base font-semibold text-gray-900 mb-4">Add product</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="block text-xs font-medium text-gray-600 mb-1">SKU</label>
            <input
              name="sku" value={form.sku} onChange={handleChange} required
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-steel"
              placeholder="SKU003"
            />
          </div>
          <div className="mb-3">
            <label className="block text-xs font-medium text-gray-600 mb-1">Name</label>
            <input
              name="name" value={form.name} onChange={handleChange} required
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-steel"
              placeholder="Aluminum Sheets"
            />
          </div>
          <div className="mb-5">
            <label className="block text-xs font-medium text-gray-600 mb-1">Quantity</label>
            <input
              name="quantity" type="number" value={form.quantity} onChange={handleChange} required
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-steel"
              placeholder="100"
            />
          </div>

          {error && <div className="mb-4 text-sm text-danger bg-red-50 border border-red-100 rounded-md px-3 py-2">{error}</div>}

          <div className="flex gap-2 justify-end">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-md">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="px-4 py-2 text-sm bg-slate-900 text-white rounded-md hover:bg-[#16212D] disabled:opacity-60">
              {loading ? 'Adding...' : 'Add product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddProductModal;