function ProductsTable({ products, userRole }) {
  const canEdit = userRole === 'admin' || userRole === 'manager';

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-200 bg-gray-50">
            <th className="text-left px-4 py-3 font-medium text-gray-600">SKU</th>
            <th className="text-left px-4 py-3 font-medium text-gray-600">Name</th>
            <th className="text-left px-4 py-3 font-medium text-gray-600">Warehouse</th>
            <th className="text-right px-4 py-3 font-medium text-gray-600">Quantity</th>
          </tr>
        </thead>
        <tbody>
          {products.length === 0 ? (
            <tr>
              <td colSpan={4} className="px-4 py-8 text-center text-gray-400">
                No products yet.
              </td>
            </tr>
          ) : (
            products.map((p) => (
              <tr key={p.id} className="border-b border-gray-100 last:border-0">
                <td className="px-4 py-3 font-mono text-xs text-gray-700">{p.sku}</td>
                <td className="px-4 py-3 text-gray-900">{p.name}</td>
                <td className="px-4 py-3 text-gray-600">{p.warehouse_name || '—'}</td>
                <td className={`px-4 py-3 text-right font-medium ${p.quantity < 10 ? 'text-danger' : 'text-gray-900'}`}>
                  {p.quantity}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default ProductsTable;