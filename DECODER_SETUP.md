# HVAC Decoder Setup Guide

This guide will help you set up the new HVAC model number decoder system that uses your Prisma database.

## Prerequisites

1. **Database**: PostgreSQL, MySQL, or SQLite database
2. **Environment Variables**: Set up your `DATABASE_URL` in `.env`
3. **Prisma CLI**: Install globally with `npm install -g prisma`

## Setup Steps

### 1. Install Dependencies

```bash
npm install @prisma/client
npm install prisma --save-dev
```

### 2. Set up Environment Variables

Create a `.env` file in your root directory:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/techtag_db"
# or for SQLite (easier for development)
# DATABASE_URL="file:./dev.db"
```

### 3. Generate Prisma Client

```bash
npx prisma generate
```

### 4. Create and Run Migrations

```bash
npx prisma migrate dev --name init
```

### 5. Seed the Database

```bash
npx prisma db seed
```

## Testing the Decoder

After setup, you can test the decoder with these sample model numbers:

### Carrier Models
- `25HCC024300` - Carrier Heat Pump, Comfort Series, 2 Ton, 13 SEER
- `25HCC036400` - Carrier Heat Pump, Comfort Series, 3 Ton, 14 SEER

### Trane Models  
- `XR13ACO24` - Trane XR Series, 13 SEER, Standard Coil, 2 Ton
- `XR16ACO36` - Trane XR Series, 16 SEER, Standard Coil, 3 Ton

### Lennox Models
- `XC13024` - Lennox XC Series, 13 SEER, 2 Ton
- `XC16048` - Lennox XC Series, 16 SEER, 4 Ton

## Adding New Decoder Rules

To add new HVAC model number rules to your database, you can either:

### Option 1: Direct Database Insert

```sql
INSERT INTO code_rules (position, characters, meaning, "group", brand, manufactor) 
VALUES (1, 'HTU', 'Heat Pump Unit', 'Product Type', 'York', 'Johnson Controls');
```

### Option 2: Prisma Studio (GUI)

```bash
npx prisma studio
```

This opens a web interface where you can easily add/edit rules.

### Option 3: Create Custom Seed Scripts

Add more rules to `prisma/seed.ts` and run:

```bash
npx prisma db seed
```

## Database Schema

Your `CodeRule` model contains:

- `id`: Auto-incrementing primary key
- `position`: Position in the model number (1-based index)
- `characters`: The actual characters to match (e.g., "HT", "024")
- `meaning`: Human-readable description
- `group`: Category (e.g., "Product Type", "Cooling Capacity")
- `brand`: Brand name (e.g., "Carrier")
- `manufactor`: Manufacturer name (e.g., "Carrier Corporation")

## API Endpoint

The decoder API is available at:

```
POST /api/decode
Content-Type: application/json

{
  "modelNumber": "25HCC024300"
}
```

## Response Format

```json
{
  "modelNumber": "25HCC024300",
  "brand": "Carrier",
  "manufacturer": "Carrier Corporation",
  "confidence": "high",
  "segments": [
    {
      "position": 1,
      "characters": "25H",
      "meaning": "Heat Pump - Air Conditioner",
      "group": "Product Type"
    },
    {
      "position": 2,
      "characters": "CC",
      "meaning": "Comfort Series",
      "group": "Product Series"
    }
  ],
  "unmatchedSegments": []
}
```

## Confidence Levels

- **High**: 80%+ match with 3+ segments
- **Medium**: 60%+ match with 2+ segments  
- **Low**: Less than 60% match

## Troubleshooting

### Database Connection Issues
- Check your `DATABASE_URL` in `.env`
- Ensure your database server is running
- Verify database credentials

### Migration Issues
```bash
npx prisma migrate reset  # This will reset your database
npx prisma migrate dev
npx prisma db seed
```

### TypeScript Issues
```bash
npx prisma generate  # Regenerate Prisma client
```

## Note on Schema

I noticed "manufactor" in your schema - if this should be "manufacturer", you can update it with a migration:

```bash
npx prisma migrate dev --name fix-manufacturer-typo
```

Then update the schema.prisma file accordingly. 