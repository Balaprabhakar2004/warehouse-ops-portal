import { useState } from 'react';
import api from '../api';

function CreateShipmentModal({ products, onClose, onSuccess }) {
  const [productId, setProductId] = useState(products[0]?.id || '');
  const [quantity, setQuantity] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await api.post('/shipments', { product_id: Number(productId), quantity: Number(quantity) });
      onSuccess();
      onClose();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create shipment');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-sm p-6">
        <h2 className="text-base font-semibold text-gray-900 mb-4">Create shipment</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="block text-xs font-medium text-gray-600 mb-1">Product</label>
            <select
              value={productId} onChange={(e) => setProductId(e.target.value)} required
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-steel"
            >
              {products.map((p) => (
                <option key={p.id} value={p.id}>{p.name} ({p.sku}) — {p.quantity} in stock</option>
              ))}
            </select>
          </div>
          <div className="mb-5">
            <label className="block text-xs font-medium text-gray-600 mb-1">Quantity to ship</label>
            <input
              type="number" value={quantity} onChange={(e) => setQuantity(e.target.value)} required
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-steel"
              placeholder="20"
            />
          </div>

          {error && <div className="mb-4 text-sm text-danger bg-red-50 border border-red-100 rounded-md px-3 py-2">{error}</div>}

          <div className="flex gap-2 justify-end">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-md">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="px-4 py-2 text-sm bg-slate-900 text-white rounded-md hover:bg-[#16212D] disabled:opacity-60">
              {loading ? 'Creating...' : 'Create shipment'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateShipmentModal;