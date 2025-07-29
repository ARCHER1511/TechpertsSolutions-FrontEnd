# Product Comparison Example

<<<<<<< HEAD

=======
<<<<<<< HEAD
=======

>>>>>>> 52145c0324eae47ab10c858dc2a92586768afc32
>>>>>>> d83075c2677b91f5abf9fc0b47458cf5bc9c0a41
## API Data Structure
Your API returns product specifications in this format:
```json
{
  "specifications": [
    {
      "id": "e7e7ca72-6090-4413-a1f8-8970862a09d9",
      "key": "speed MHZ",
      "value": "30000"
    },
    {
      "id": "f8f8db83-7201-5524-b2g9-9081973b10ea",
      "key": "memory",
      "value": "16GB"
    },
    {
      "id": "g9g9ec94-8312-6635-c3h0-0192084c21fb",
      "key": "power consumption",
      "value": "250W"
    }
  ]
}
```

## How Comparison Works

### 1. **Speed MHZ Comparison**
- **Product A**: "speed MHZ" = "30000"
- **Product B**: "speed MHZ" = "28000"
- **Result**: Product A wins (higher speed is better)
- **Display**: "+2000 MHZ"

### 2. **Memory Comparison**
- **Product A**: "memory" = "16GB"
- **Product B**: "memory" = "8GB"
- **Result**: Product A wins (more memory is better)
- **Display**: "+8GB"

### 3. **Power Consumption Comparison**
- **Product A**: "power consumption" = "250W"
- **Product B**: "power consumption" = "200W"
- **Result**: Product B wins (lower power consumption is better)
- **Display**: "-50W"

## Supported Specification Types

### Higher is Better:
- `speed`, `speed mhz`, `speed MHZ`
- `memory`, `ram`, `storage`
- `cores`, `threads`
- `frequency`, `clock speed`
- `bandwidth`, `performance`
- `score`, `rating`

### Lower is Better:
- `power consumption`, `tdp`, `wattage`
- `latency`, `response time`
- `delay`, `wait time`

### Price Comparison:
- `price`, `cost`

### Text Comparison:
- `type`, `status`, `manufacturer`
- `brand`, `model`, `interface`
- `form factor`, `color`, `material`

## Smart Features

### 1. **Automatic Unit Detection**
- Extracts units from values (GB, MHZ, W, etc.)
- Displays differences with proper units

### 2. **Flexible Key Matching**
- Matches "speed MHZ", "Speed MHZ", "speed mhz"
- Handles variations in key names

### 3. **Comprehensive Comparison**
- Shows all specifications from both products
- Handles missing specifications gracefully
- Provides detailed analysis

### 4. **Visual Indicators**
- 🟢 Green for better specifications
- 🔴 Red for worse specifications
- ⚪ Gray for equal specifications

## Example Output

| Specification | Product A | Product B | Comparison | Difference |
|---------------|-----------|-----------|------------|------------|
| Speed MHZ | 30000 | 28000 | Product A is better | +2000 MHZ |
| Memory | 16GB | 8GB | Product A is better | +8GB |
| Power Consumption | 250W | 200W | Product B is better | -50W |
| Price | $500 | $450 | Product B is better | -$50 |

## Performance Summary
- **Better Specifications**: Product A: 2, Product B: 2
- **Equal Specifications**: 0
- **Total Compared**: 4

## Recommendation
"Both products are very similar in performance. Consider factors like price, brand preference, or specific features that matter most to you." 