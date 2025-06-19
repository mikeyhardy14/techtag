// Test script for ClimateMaster API setup
// Run with: node test-climatemaster-api.js

const testModelNumber = 'TTV036A1C2WRS';

async function testDecodeAPI() {
  console.log('🧪 Testing ClimateMaster Decoder API');
  console.log('=====================================');
  console.log(`Testing model number: ${testModelNumber}`);
  console.log('');

  try {
    const response = await fetch('http://localhost:3000/api/decode', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ modelNumber: testModelNumber }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.log('❌ API Error:', errorData);
      return;
    }

    const result = await response.json();
    
    console.log('✅ Decode Result:');
    console.log('================');
    console.log(`Model Number: ${result.modelNumber}`);
    console.log(`Brand: ${result.brand}`);
    console.log(`Manufacturer: ${result.manufacturer}`);
    console.log(`Confidence: ${result.confidence}`);
    console.log('');

    if (result.segments && result.segments.length > 0) {
      console.log('📋 Decoded Segments:');
      console.log('===================');
      result.segments.forEach(segment => {
        console.log(`${segment.group} (${segment.position}): ${segment.characters} = ${segment.meaning}`);
      });
      console.log('');
    }

    if (result.unmatchedSegments && result.unmatchedSegments.length > 0) {
      console.log('⚠️  Unmatched Segments:');
      console.log('======================');
      result.unmatchedSegments.forEach(segment => {
        console.log(`- ${segment}`);
      });
      console.log('');
    }

    console.log('🎉 Test completed successfully!');

  } catch (error) {
    console.log('❌ Test failed:', error.message);
    
    if (error.message.includes('ECONNREFUSED')) {
      console.log('');
      console.log('💡 Tip: Make sure your Next.js server is running:');
      console.log('   npm run dev');
    }
  }
}

async function testDatabaseAPI() {
  console.log('');
  console.log('🔗 Testing Database API Connection');
  console.log('==================================');
  
  // This will show what requests your database should expect
  const sampleRequests = [
    { id: 'model_type', manufacture: 'climatemaster', description: 'TT' },
    { id: 'configuration', manufacture: 'climatemaster', description: 'V' },
    { id: 'unit_size', manufacture: 'climatemaster', description: '036' },
    { id: 'revision_level', manufacture: 'climatemaster', description: 'A' },
    { id: 'voltage', manufacture: 'climatemaster', description: '1' },
  ];

  console.log('Your database API should handle requests like these:');
  console.log('');
  
  sampleRequests.forEach((req, index) => {
    console.log(`${index + 1}. POST to your DATABASE_API_URL:`);
    console.log(`   ${JSON.stringify(req)}`);
    console.log(`   Expected response: "Description for ${req.description}"`);
    console.log('');
  });
}

// Run the tests
async function runTests() {
  await testDecodeAPI();
  await testDatabaseAPI();
}

runTests().catch(console.error); 