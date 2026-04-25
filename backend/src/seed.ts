import 'dotenv/config';
import connectDB from './config/db';
import Tree from './models/Tree';

const trees = [
  { plan: 'sapling', name: 'Sapling Plan', yieldMin: 15, yieldMax: 25, pricePerSeason: 2499 },
  { plan: 'sapling', name: 'Sapling Plan', yieldMin: 15, yieldMax: 25, pricePerSeason: 2499 },
  { plan: 'adult',   name: 'Adult Tree Plan', yieldMin: 25, yieldMax: 40, pricePerSeason: 4999 },
  { plan: 'adult',   name: 'Adult Tree Plan', yieldMin: 25, yieldMax: 40, pricePerSeason: 4999 },
  { plan: 'grand',   name: 'Grand Tree Plan', yieldMin: 40, yieldMax: 60, pricePerSeason: 8999 },
  { plan: 'grand',   name: 'Grand Tree Plan', yieldMin: 40, yieldMax: 60, pricePerSeason: 8999 },
];

connectDB().then(async () => {
  await Tree.deleteMany({});
  await Tree.insertMany(trees);
  console.log('Seeded 6 trees');
  process.exit(0);
});
