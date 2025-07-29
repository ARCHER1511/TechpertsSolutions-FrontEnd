# Verification Guide: Testing Comparison with Database Data

## ✅ **How to Verify the Comparison System Works**

### **1. Test the Comparison Logic**

Visit: `http://localhost:53754/test-comparison`

This will show you a test page with sample data that demonstrates how the comparison works with different specification keys and values.

### **2. Expected Test Results**

The test component uses this sample data:

**Product A:**
```json
{
  "specifications": [
    {
      "key": "Memory",
      "value": "8"
    },
    {
      "key": "speed MHZ", 
      "value": "30000"
    },
    {
      "key": "power consumption",
      "value": "250W"
    }
  ]
}
```

**Product B:**
```json
{
  "specifications": [
    {
      "key": "Memory",
      "value": "16"
    },
    {
      "key": "speed MHZ",
      "value": "28000"
    },
    {
      "key": "power consumption", 
      "value": "200W"
    }
  ]
}
```

### **3. Expected Comparison Results**

| Specification | Product A | Product B | Comparison | Difference |
|---------------|-----------|-----------|------------|------------|
| Memory | 8 | 16 | Product B has more memory | +8 |
| speed MHZ | 30000 | 28000 | Product A has higher speed | +2000 |
| power consumption | 250W | 200W | Product B is more power efficient | -50W |

### **4. Database Integration Verification**

To verify with your actual database data:

#### **Step 1: Add Test Data to Database**
Add these specifications to your products in the database:

**Product 1:**
```sql
INSERT INTO ProductSpecifications (ProductId, Key, Value) VALUES 
('product-id-1', 'Memory', '8'),
('product-id-1', 'speed MHZ', '30000'),
('product-id-1', 'power consumption', '250W');
```

**Product 2:**
```sql
INSERT INTO ProductSpecifications (ProductId, Key, Value) VALUES 
('product-id-2', 'Memory', '16'),
('product-id-2', 'speed MHZ', '28000'),
('product-id-2', 'power consumption', '200W');
```

#### **Step 2: Test with Real API**
1. Start your backend API server
2. Visit: `http://localhost:53754/pc-compare`
3. Select a category
4. Choose two products with the specifications above
5. Verify the comparison results match the expected output

### **5. Supported Specification Keys**

The system recognizes these keys (case-insensitive):

#### **Memory Specifications (Higher is Better):**
- `Memory`, `memory`
- `RAM`, `ram`
- `Storage`, `storage`
- `Capacity`, `capacity`

#### **Speed Specifications (Higher is Better):**
- `speed`, `Speed`
- `speed MHZ`, `speed mhz`, `Speed MHZ`
- `frequency`, `Frequency`
- `clock speed`, `Clock Speed`

#### **Power Specifications (Lower is Better):**
- `power consumption`, `Power Consumption`
- `tdp`, `TDP`
- `wattage`, `Wattage`

#### **Other Specifications:**
- `cores`, `Cores` (Higher is Better)
- `threads`, `Threads` (Higher is Better)
- `price`, `Price` (Lower is Better)
- `cost`, `Cost` (Lower is Better)

### **6. Value Format Support**

The system handles various value formats:

#### **Numeric Values:**
- `"8"` → Extracts: 8
- `"16"` → Extracts: 16
- `"30000"` → Extracts: 30000

#### **Values with Units:**
- `"8GB"` → Extracts: 8, Unit: GB
- `"16GB"` → Extracts: 16, Unit: GB
- `"250W"` → Extracts: 250, Unit: W
- `"30000MHZ"` → Extracts: 30000, Unit: MHZ

#### **Text Values:**
- `"DDR4"` → Text comparison
- `"Intel"` → Text comparison
- `"Available"` → Text comparison

### **7. Testing Different Scenarios**

#### **Scenario 1: Memory Comparison**
```json
Product A: {"key": "Memory", "value": "8"}
Product B: {"key": "Memory", "value": "16"}
Result: Product B wins (+8 difference)
```

#### **Scenario 2: Speed Comparison**
```json
Product A: {"key": "speed MHZ", "value": "30000"}
Product B: {"key": "speed MHZ", "value": "28000"}
Result: Product A wins (+2000 difference)
```

#### **Scenario 3: Power Comparison**
```json
Product A: {"key": "power consumption", "value": "250W"}
Product B: {"key": "power consumption", "value": "200W"}
Result: Product B wins (-50W difference)
```

#### **Scenario 4: Mixed Specifications**
```json
Product A: [
  {"key": "Memory", "value": "8"},
  {"key": "speed MHZ", "value": "30000"}
]
Product B: [
  {"key": "Memory", "value": "16"},
  {"key": "speed MHZ", "value": "28000"}
]
Result: 
- Memory: Product B wins (+8)
- Speed: Product A wins (+2000)
```

### **8. Verification Checklist**

- [ ] Test component loads at `/test-comparison`
- [ ] Memory comparison works (8 vs 16)
- [ ] Speed comparison works (30000 vs 28000)
- [ ] Power comparison works (250W vs 200W)
- [ ] Units are displayed correctly
- [ ] Better/worse indicators work
- [ ] Performance summary shows correct counts
- [ ] Recommendations are generated
- [ ] Real API data loads (when backend is running)

### **9. Troubleshooting**

#### **If API calls fail:**
1. Check if backend is running on `http://localhost:7230`
2. Verify API endpoints are accessible
3. Check browser console for errors

#### **If comparison doesn't work:**
1. Verify specification keys match exactly
2. Check that values are in the correct format
3. Ensure products have specifications loaded

#### **If SSL errors occur:**
1. Use HTTP instead of HTTPS in environment.ts
2. Or configure SSL certificates properly

### **10. Expected Console Output**

When testing, you should see in the browser console:
```
Loaded specifications for Product A: [...]
Loaded specifications for Product B: [...]
Test comparison results: [...]
```

This confirms that the comparison logic is working correctly with your database data structure. 