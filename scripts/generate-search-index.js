// Script to generate search index for static site
const { generateSearchIndex } = require('../dist/lib/searchIndex');

async function main() {
  console.log('Generating search index...');
  await generateSearchIndex();
  console.log('Search index generation complete');
}

main().catch(err => {
  console.error('Error generating search index:', err);
  process.exit(1);
});
