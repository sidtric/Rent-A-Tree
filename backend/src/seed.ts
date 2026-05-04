import 'dotenv/config';
import connectDB from './config/db';
import Tree from './models/Tree';

const trees = [
  { plan: 'sapling', name: 'Chausa Mango (Farm Fresh)',      location: 'Block A, Ramnagar', yieldMin: 15, yieldMax: 20, priceMin: 1999, priceMax: 2499, pricePerSeason: 1999, isAvailable: true },
  { plan: 'sapling', name: 'Dasheri Mango (Orchard Select)', location: 'Block B, Ramnagar', yieldMin: 15, yieldMax: 20, priceMin: 1999, priceMax: 2499, pricePerSeason: 1999, isAvailable: true },
  { plan: 'sapling', name: 'Langra Mango (Village Special)', location: 'Block C, Ramnagar', yieldMin: 15, yieldMax: 20, priceMin: 1999, priceMax: 2499, pricePerSeason: 1999, isAvailable: true },
  { plan: 'adult',   name: 'Chausa Mango (Farm Fresh)',      location: 'Block A, Ramnagar', yieldMin: 25, yieldMax: 35, priceMin: 2999, priceMax: 3999, pricePerSeason: 2999, isAvailable: true },
  { plan: 'adult',   name: 'Dasheri Mango (Orchard Select)', location: 'Block B, Ramnagar', yieldMin: 25, yieldMax: 35, priceMin: 2999, priceMax: 3999, pricePerSeason: 2999, isAvailable: true },
  { plan: 'adult',   name: 'Langra Mango (Village Special)', location: 'Block C, Ramnagar', yieldMin: 25, yieldMax: 35, priceMin: 2999, priceMax: 3999, pricePerSeason: 2999, isAvailable: true },
  { plan: 'grand',   name: 'Chausa Mango (Farm Fresh)',      location: 'Block A, Ramnagar', yieldMin: 40, yieldMax: 60, priceMin: 4999, priceMax: 6999, pricePerSeason: 4999, isAvailable: true },
  { plan: 'grand',   name: 'Dasheri Mango (Orchard Select)', location: 'Block B, Ramnagar', yieldMin: 40, yieldMax: 60, priceMin: 4999, priceMax: 6999, pricePerSeason: 4999, isAvailable: true },
  { plan: 'grand',   name: 'Langra Mango (Village Special)', location: 'Block C, Ramnagar', yieldMin: 40, yieldMax: 60, priceMin: 4999, priceMax: 6999, pricePerSeason: 4999, isAvailable: true },
];

connectDB().then(async () => {
  await Tree.deleteMany({});
  await Tree.insertMany(trees);
  console.log(`Seeded ${trees.length} trees`);
  process.exit(0);
});
