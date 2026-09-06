import { useState } from 'react';
import api from '../api';

const statusStyles = {
  pending: 'bg-amber-50 text-warning',
  in_transit: 'bg-blue-50 text-steel',
  delivered: 'bg-green-50 text-success',
};

const STATUS_OPTIONS = ['pending', 'in_transit', 'delivered'];

function ShipmentsTable({ shipments, userRole, onRefresh }) {
  const [updatingId, setUpdatingId] = useState(null);

  const handleStatusChange = async (shipmentId, newStatus) => {
    setUpdatingId(shipmentId);
    try {
      await api.patch(`/shipments/${shipmentId}/status`, { status: newStatus });
      onRefresh();
    } catch (err) {
      console.error('Failed to update status', err);
      alert(err.response?.data?.error || 'Failed to update status');
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-200 bg-gray-50">
            <th className="text-left px-4 py-3 font-medium text-gray-600">Product</th>
            <th className="text-left px-4 py-3 font-medium text-gray-600">SKU</th>
            <th className="text-right px-4 py-3 font-medium text-gray-600">Quantity</th>
            <th className="text-left px-4 py-3 font-medium text-gray-600">Status</th>
          </tr>
        </thead>
        <tbody>
          {shipments.length === 0 ? (
            <tr>
              <td colSpan={4} className="px-4 py-8 text-center text-gray-400">
                No shipments yet.
              </td>
            </tr>
          ) : (
            shipments.map((s) => (
              <tr key={s.id} className="border-b border-gray-100 last:border-0">
                <td className="px-4 py-3 text-gray-900">{s.product_name}</td>
                <td className="px-4 py-3 font-mono text-xs text-gray-700">{s.sku}</td>
                <td className="px-4 py-3 text-right text-gray-900">{s.quantity}</td>
                <td className="px-4 py-3">
                  <select
                    value={s.status}
                    disabled={updatingId === s.id}
                    onChange={(e) => handleStatusChange(s.id, e.target.value)}
                    className={`px-2 py-1 rounded text-xs font-medium border-0 cursor-pointer ${statusStyles[s.status]}`}
                  >
                    {STATUS_OPTIONS.map((opt) => (
                      <option key={opt} value={opt}>{opt.replace('_', ' ')}</option>
                    ))}
                  </select>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default ShipmentsTable;