# HTTPS SSL Certificate Resolution Guide

## 🚨 **Current Issue**
The application is configured to use HTTPS (`https://localhost:7230/api`) but encounters SSL certificate errors because the backend is using a self-signed certificate for development.

## ✅ **Solution: Accept the Certificate**

### **Step 1: Accept the Certificate in Your Browser**

1. **Open your browser** (Chrome, Firefox, Edge, etc.)
2. **Navigate to**: `https://localhost:7230`
3. **You'll see a security warning** - click "Advanced" or "Show Details"
4. **Click "Proceed to localhost (unsafe)"** or "Accept the Risk and Continue"
5. **The page should load successfully** (even if it's just an API endpoint)

### **Step 2: Verify the Certificate is Accepted**

After accepting the certificate, your Angular app should be able to make API calls successfully.

## 🔧 **Alternative Solutions**

### **Option 1: Configure Backend SSL (Recommended for Production)**

If you have access to the backend code, configure proper SSL certificates:

#### **For .NET Core:**
```csharp
// In Program.cs or Startup.cs
builder.Services.AddHttpsRedirection(options =>
{
    options.HttpsPort = 7230;
});

// Use proper SSL certificates
builder.WebHost.UseUrls("https://localhost:7230");
```

#### **For Node.js/Express:**
```javascript
const https = require('https');
const fs = require('fs');

const options = {
  key: fs.readFileSync('path/to/key.pem'),
  cert: fs.readFileSync('path/to/cert.pem')
};

https.createServer(options, app).listen(7230);
```

### **Option 2: Use mkcert for Development**

Install mkcert to create valid local certificates:

```bash
# Install mkcert
npm install -g mkcert

# Create and install local CA
mkcert -install

# Create certificate for localhost
mkcert localhost 127.0.0.1 ::1

# Use the generated certificates in your backend
```

## 🧪 **Testing the Fix**

### **1. Test API Directly**
```bash
curl -X GET "https://localhost:7230/api/Category/All" \
  -H "accept: application/json"
```

### **2. Test Product API**
```bash
curl -X GET "https://localhost:7230/api/Product/e0dc4df4-64a3-47e2-ba98-c2318e13fe12" \
  -H "accept: application/json"
```

### **3. Test Angular App**
1. **Start the Angular app**: `ng serve -o`
2. **Navigate to PC Compare page**
3. **Click the test button**: "🧪 Test RTX 3050 vs RTX 4090 Comparison"
4. **Check browser console** for successful API calls

## 📊 **Expected Results**

After accepting the certificate, you should see:

### **Console Output:**
```
📦 Categories with products loaded from API: [...]
📋 Products loaded for dropdown (without specifications): [...]
🧪 Testing comparison with specific product IDs...
Loading RTX 3050...
✅ RTX 3050 loaded: { id: "e0dc4df4-64a3-47e2-ba98-c2318e13fe12", name: "RTX 3050", specifications: [{ key: "speed MHZ", value: "30000" }] }
Loading RTX 4090...
✅ RTX 4090 loaded: { id: "ce0702b5-fe57-4e8d-9eac-d50758ac19fe", name: "RTX 4090", specifications: [{ key: "speed MHZ", value: "50000" }] }
🔄 Starting comparison...
🔍 Comparing specifications between:
📊 Specs1 count: 1
📊 Specs2 count: 1
🔑 Specs1 keys: ["speed MHZ"]
🔑 Specs2 keys: ["speed MHZ"]
🎯 All unique spec keys: ["speed MHZ"]
```

### **Comparison Table:**
| Specification | RTX 3050 | RTX 4090 | Comparison | Difference |
|---------------|----------|----------|------------|------------|
| speed MHZ | 30000 | 50000 | RTX 4090 has higher speed | +20000 |

## 🚀 **Benefits of Using HTTPS**

1. **Security**: Encrypted communication between frontend and backend
2. **Production Ready**: Same configuration as production environment
3. **Modern Standards**: Follows current web security best practices
4. **API Compatibility**: Works with modern browsers and security policies

## 🔍 **Troubleshooting**

### **If Certificate Still Not Accepted:**
1. **Clear browser cache and cookies**
2. **Try a different browser**
3. **Check if backend is running on HTTPS**
4. **Verify port 7230 is correct**

### **If API Calls Still Fail:**
1. **Check browser console** for specific error messages
2. **Verify backend is running**: `https://localhost:7230`
3. **Test with curl** to isolate the issue
4. **Check network tab** in browser dev tools

## 📝 **Summary**

The application is correctly configured to use HTTPS. The SSL certificate issue is a development environment problem that can be resolved by accepting the self-signed certificate in your browser. This approach maintains security while allowing the comparison functionality to work with real API data. 