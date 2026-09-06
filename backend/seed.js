const pool = require('./db');

const warehouses = [
  { name: 'Bengaluru Central', location: 'Bengaluru, India' },
  { name: 'Chennai East', location: 'Chennai, India' },
  { name: 'Hyderabad North', location: 'Hyderabad, India' },
];

const productNames = [
  'Steel Rods', 'Copper Wire', 'Aluminum Sheets', 'PVC Pipes', 'Cement Bags',
  'Glass Panels', 'Rubber Gaskets', 'Plastic Containers', 'Wooden Pallets',
  'Ball Bearings', 'Hydraulic Hoses', 'Electric Motors', 'Circuit Boards',
  'LED Panels', 'Solar Cells', 'Battery Packs', 'Industrial Fans', 'Valves',
  'Pressure Gauges', 'Safety Helmets',
];

async function seed() {
  console.log('Seeding warehouses...');
  const warehouseIds = [];
  for (const w of warehouses) {
    const res = await pool.query(
      'INSERT INTO warehouses (name, location) VALUES ($1, $2) RETURNING id',
      [w.name, w.location]
    );
    warehouseIds.push(res.rows[0].id);
  }

  console.log('Seeding products...');
  const productIds = [];
  for (let i = 0; i < 60; i++) {
    const name = productNames[i % productNames.length];
    const sku = `SKU-${1000 + i}`;
    const quantity = Math.floor(Math.random() * 200); // some will be < 10 (low stock)
    const warehouseId = warehouseIds[i % warehouseIds.length];

    const res = await pool.query(
      `INSERT INTO products (sku, name, quantity, warehouse_id) VALUES ($1, $2, $3, $4) RETURNING id`,
      [sku, `${name} - Batch ${i}`, quantity, warehouseId]
    );
    productIds.push({ id: res.rows[0].id, quantity });
  }

  console.log('Seeding shipments...');
  const statuses = ['pending', 'in_transit', 'delivered'];
  for (let i = 0; i < 80; i++) {
    const product = productIds[Math.floor(Math.random() * productIds.length)];
    const qty = Math.max(1, Math.floor(Math.random() * 20));
    const status = statuses[Math.floor(Math.random() * statuses.length)];

    await pool.query(
      `INSERT INTO shipments (product_id, quantity, status, created_at) VALUES ($1, $2, $3, NOW() - INTERVAL '1 day' * $4)`,
      [product.id, qty, status, Math.floor(Math.random() * 30)]
    );
  }

  console.log('Seeding complete: 3 warehouses, 60 products, 80 shipments.');
  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});