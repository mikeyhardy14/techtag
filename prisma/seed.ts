import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database with HVAC model number rules...');

  // Sample rules for Carrier brand heat pumps
  const carrierRules = [
    {
      position: 1,
      characters: '25H',
      meaning: 'Heat Pump - Air Conditioner',
      group: 'Product Type',
      brand: 'Carrier',
      manufactor: 'Carrier Corporation'
    },
    {
      position: 2,
      characters: 'CC',
      meaning: 'Comfort Series',
      group: 'Product Series',
      brand: 'Carrier',
      manufactor: 'Carrier Corporation'
    },
    {
      position: 3,
      characters: '024',
      meaning: '2 Ton (24,000 BTU/hr)',
      group: 'Cooling Capacity',
      brand: 'Carrier',
      manufactor: 'Carrier Corporation'
    },
    {
      position: 3,
      characters: '036',
      meaning: '3 Ton (36,000 BTU/hr)',
      group: 'Cooling Capacity',
      brand: 'Carrier',
      manufactor: 'Carrier Corporation'
    },
    {
      position: 3,
      characters: '048',
      meaning: '4 Ton (48,000 BTU/hr)',
      group: 'Cooling Capacity',
      brand: 'Carrier',
      manufactor: 'Carrier Corporation'
    },
    {
      position: 4,
      characters: '300',
      meaning: '13 SEER',
      group: 'Efficiency Rating',
      brand: 'Carrier',
      manufactor: 'Carrier Corporation'
    },
    {
      position: 4,
      characters: '400',
      meaning: '14 SEER',
      group: 'Efficiency Rating',
      brand: 'Carrier',
      manufactor: 'Carrier Corporation'
    }
  ];

  // Sample rules for Trane brand units
  const traneRules = [
    {
      position: 1,
      characters: 'XR',
      meaning: 'XR Series Air Conditioner',
      group: 'Product Type',
      brand: 'Trane',
      manufactor: 'Trane Inc.'
    },
    {
      position: 2,
      characters: '13',
      meaning: '13 SEER Efficiency',
      group: 'Efficiency Rating',
      brand: 'Trane',
      manufactor: 'Trane Inc.'
    },
    {
      position: 2,
      characters: '14',
      meaning: '14 SEER Efficiency',
      group: 'Efficiency Rating',
      brand: 'Trane',
      manufactor: 'Trane Inc.'
    },
    {
      position: 2,
      characters: '16',
      meaning: '16 SEER Efficiency',
      group: 'Efficiency Rating',
      brand: 'Trane',
      manufactor: 'Trane Inc.'
    },
    {
      position: 3,
      characters: 'ACO',
      meaning: 'Standard Coil Configuration',
      group: 'Coil Type',
      brand: 'Trane',
      manufactor: 'Trane Inc.'
    },
    {
      position: 4,
      characters: '24',
      meaning: '2 Ton (24,000 BTU/hr)',
      group: 'Cooling Capacity',
      brand: 'Trane',
      manufactor: 'Trane Inc.'
    },
    {
      position: 4,
      characters: '36',
      meaning: '3 Ton (36,000 BTU/hr)',
      group: 'Cooling Capacity',
      brand: 'Trane',
      manufactor: 'Trane Inc.'
    },
    {
      position: 4,
      characters: '48',
      meaning: '4 Ton (48,000 BTU/hr)',
      group: 'Cooling Capacity',
      brand: 'Trane',
      manufactor: 'Trane Inc.'
    }
  ];

  // Sample rules for Lennox brand units
  const lennoxRules = [
    {
      position: 1,
      characters: 'XC',
      meaning: 'XC Series High Efficiency',
      group: 'Product Series',
      brand: 'Lennox',
      manufactor: 'Lennox International'
    },
    {
      position: 2,
      characters: '13',
      meaning: '13 SEER Air Conditioner',
      group: 'Product Type',
      brand: 'Lennox',
      manufactor: 'Lennox International'
    },
    {
      position: 2,
      characters: '16',
      meaning: '16 SEER Air Conditioner',
      group: 'Product Type',
      brand: 'Lennox',
      manufactor: 'Lennox International'
    },
    {
      position: 3,
      characters: '024',
      meaning: '2 Ton (24,000 BTU/hr)',
      group: 'Cooling Capacity',
      brand: 'Lennox',
      manufactor: 'Lennox International'
    },
    {
      position: 3,
      characters: '036',
      meaning: '3 Ton (36,000 BTU/hr)',
      group: 'Cooling Capacity',
      brand: 'Lennox',
      manufactor: 'Lennox International'
    },
    {
      position: 3,
      characters: '048',
      meaning: '4 Ton (48,000 BTU/hr)',
      group: 'Cooling Capacity',
      brand: 'Lennox',
      manufactor: 'Lennox International'
    }
  ];

  // Combine all rules
  const allRules = [...carrierRules, ...traneRules, ...lennoxRules];

  // Insert rules into database
  for (const rule of allRules) {
    await prisma.codeRule.create({
      data: rule
    });
  }

  console.log(`✅ Seeded ${allRules.length} decoding rules`);
  console.log('Sample model numbers to test:');
  console.log('- 25HCC024300 (Carrier Heat Pump, Comfort Series, 2 Ton, 13 SEER)');
  console.log('- XR13ACO24 (Trane XR Series, 13 SEER, Standard Coil, 2 Ton)');
  console.log('- XC13024 (Lennox XC Series, 13 SEER, 2 Ton)');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

