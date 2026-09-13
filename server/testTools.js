import { searchWeb } from './tools/webSearch.js';
import { readWebPage } from './tools/webReader.js';

async function testTools() {
  console.log('Testing searchWeb...');
  const searchRes = await searchWeb('ReAct AI agent');
  console.log('searchRes:', JSON.stringify(searchRes, null, 2));

  console.log('\nTesting readWebPage...');
  const readRes = await readWebPage('https://en.wikipedia.org/wiki/Artificial_intelligence');
  console.log('readRes title:', readRes.title);
  console.log('readRes snippet length:', readRes.contentSnippet?.length);
  console.log('readRes success:', readRes.success);
}

testTools();
