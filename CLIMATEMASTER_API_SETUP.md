# ClimateMaster Supabase Integration Setup Guide

This guide explains how to configure the HVAC decoder to work with your ClimateMaster "techtag" table in Supabase.

## 🔧 **Environment Setup**

Add these variables to your `.env.local` file:

```env
NEXT_PUBLIC_SUPABASE_URL="https://your-project.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key-here"
```

Replace with your actual Supabase project URL and anonymous key from your Supabase dashboard.

## 📊 **Supabase Table Structure**

The decoder queries the **"techtag"** table with this structure:

### **Required Columns**
- **key** (text): The actual characters from that position in the model number
- **manufacture** (text): Always `"climatemaster"` for ClimateMaster models
- **description** (text): The segment identifier (`model_type`, `configuration`, `unit_size`, etc.)
- **value** (text): The decoded meaning/description returned to the user

### **Example Table Data**
```sql
INSERT INTO techtag (key, manufacture, description, value) VALUES
('TT', 'climatemaster', 'model_type', 'Water-to-Air Heat Pump'),
('TV', 'climatemaster', 'model_type', 'Water-to-Water Heat Pump'),
('V', 'climatemaster', 'configuration', 'Vertical Configuration'),
('H', 'climatemaster', 'configuration', 'Horizontal Configuration'),
('036', 'climatemaster', 'unit_size', '3 Ton (36,000 BTU/hr)'),
('1', 'climatemaster', 'voltage', '208-230V/1Ph/60Hz'),
-- ... more entries
```

## 🏗️ **ClimateMaster Model Number Parsing**

The decoder parses ClimateMaster model numbers by character position:

| Position | Characters | Database ID | Description |
|----------|------------|-------------|-------------|
| 1-2 | `TT` | `model_type` | Model Type |
| 3 | `V` | `configuration` | Configuration |
| 4-6 | `036` | `unit_size` | Unit Size |
| 7 | `A` | `revision_level` | Revision Level |
| 8 | `1` | `voltage` | Voltage |
| 9 | `C` | `controls` | Controls |
| 10 | `2` | `cabinet_insulation` | Cabinet Insulation |
| 11 | `W` | `water_circuit_options` | Water Circuit Options |
| 12 | `H` | `heat_exchanger_options` | Heat Exchanger Options |
| 13 | `R` | `return_air` | Return Air |
| 14 | `S` | `supply_air` | Supply Air |

### **Example Model Number: `TTV036A1C2WRS`**

The decoder will make these Supabase queries:

1. `SELECT * FROM techtag WHERE key='TT' AND manufacture='climatemaster' AND description='model_type'`
2. `SELECT * FROM techtag WHERE key='V' AND manufacture='climatemaster' AND description='configuration'`
3. `SELECT * FROM techtag WHERE key='036' AND manufacture='climatemaster' AND description='unit_size'`
4. `SELECT * FROM techtag WHERE key='A' AND manufacture='climatemaster' AND description='revision_level'`
5. `SELECT * FROM techtag WHERE key='1' AND manufacture='climatemaster' AND description='voltage'`
6. `SELECT * FROM techtag WHERE key='C' AND manufacture='climatemaster' AND description='controls'`
7. `SELECT * FROM techtag WHERE key='2' AND manufacture='climatemaster' AND description='cabinet_insulation'`
8. `SELECT * FROM techtag WHERE key='W' AND manufacture='climatemaster' AND description='water_circuit_options'`
9. `SELECT * FROM techtag WHERE key='R' AND manufacture='climatemaster' AND description='heat_exchanger_options'`
10. `SELECT * FROM techtag WHERE key='S' AND manufacture='climatemaster' AND description='return_air'`

## 🧪 **Testing Your Setup**

### **1. Test Supabase Connection**

Test your Supabase table directly from the SQL editor:

```sql
SELECT * FROM techtag 
WHERE key = 'TT' 
AND manufacture = 'climatemaster' 
AND description = 'model_type';
```

Expected result: A row with the value like `"Water-to-Air Heat Pump"`

### **2. Test Through Decoder**

1. Start your Next.js server: `npm run dev`
2. Go to: `http://localhost:3000/decode`
3. Enter a test model number: `TTV036A1C2WRS`
4. Click "Decode"

### **Expected Result**

You should see something like:

```
✅ High Confidence

Brand: ClimateMaster
Manufacturer: climatemaster

Model Type (1-2):
- TT: Water-to-Air Heat Pump

Configuration (3):
- V: Vertical Configuration

Unit Size (4-6):
- 036: 3 Ton (36,000 BTU/hr)

[... and so on for each segment]
```

## 🔧 **Supabase Configuration**

### **Row Level Security (RLS)**

Make sure your "techtag" table allows SELECT queries from your application:

```sql
-- Enable RLS
ALTER TABLE techtag ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Allow public read access" 
ON techtag FOR SELECT 
USING (true);
```

### **Database Timeout**

The API has a 5-second timeout for database requests. You can modify this in `app/api/decode/route.ts`:

```typescript
signal: AbortSignal.timeout(5000), // Change timeout here
```

### **Adding More Brands**

Currently set to always use "climatemaster". To add more brands, modify the brand detection logic:

```typescript
// In app/api/decode/route.ts
const brandPrefix = cleanModelNumber.substring(0, 2);

let manufacturer: string;
if (brandPrefix === 'TT' || brandPrefix === 'TV') {
  manufacturer = 'climatemaster';
} else if (brandPrefix === 'CA') {
  manufacturer = 'carrier';
} 
// Add more brand logic here
```

## 🐛 **Troubleshooting**

### **No Results Returned**

1. **Check Environment Variables**: Verify `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`
2. **Test Supabase Directly**: Use the SQL editor to query your techtag table
3. **Check RLS Policies**: Ensure your table allows public read access
4. **Check Logs**: Look at browser console and server logs for errors

### **Partial Results**

1. **Database Coverage**: Some segments may not have entries in your techtag table
2. **Model Number Length**: Ensure model numbers are at least 10-14 characters
3. **Character Validation**: Check for invalid characters in model number

### **Connection Errors**

1. **Supabase URL**: Verify your project URL is correct
2. **API Key**: Ensure your anon key has proper permissions
3. **Network**: Check firewall/proxy settings

## 📊 **API Monitoring**

The decoder logs:
- Failed Supabase queries
- Response times
- Error details

Check your server logs for debugging information:

```bash
# View logs in development
npm run dev

# Check specific errors in console
# Look for "Supabase query error" messages
```

## 🔄 **Next Steps**

1. **Set up your Supabase project and create the "techtag" table**
2. **Populate the table with your ClimateMaster data**
3. **Update your `.env.local` file with Supabase credentials**
4. **Configure RLS policies for public read access**
5. **Test with a sample ClimateMaster model number**

## 📝 **Sample Model Numbers to Test**

- `TTV036A1C2WRS` - Full 14-character model
- `TT036A1C` - Shorter model (will have unmatched segments)
- `XYZ123` - Invalid model (should show no matches)

Your decoder is now ready to work with your ClimateMaster Supabase database! 🚀 