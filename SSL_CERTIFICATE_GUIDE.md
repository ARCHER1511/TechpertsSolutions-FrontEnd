# SSL Certificate Guide: Using HTTPS in Development

## 🔒 **Current Setup**

Your application is now configured to use HTTPS:
```typescript
// src/app/Environment/environment.ts
static baseUrl: string = 'https://localhost:7230/api';
```

## 🚨 **SSL Certificate Issues**

When using HTTPS with self-signed certificates in development, you may encounter SSL certificate errors. Here are the solutions:

## ✅ **Solution 1: Accept the Certificate in Browser (Recommended)**

### **Step 1: Visit Your Backend Directly**
1. Open your browser
2. Navigate to: `https://localhost:7230`
3. You'll see a security warning
4. Click "Advanced" or "Show Details"
5. Click "Proceed to localhost (unsafe)" or "Accept the Risk and Continue"

### **Step 2: Verify Certificate is Accepted**
- The page should load (even if it shows an error page)
- This tells your browser to trust the certificate for this domain

### **Step 3: Test Your Frontend**
- Now your Angular app should be able to make API calls to `https://localhost:7230`
- Visit: `https://localhost:54615/debug-specifications` to test

## ✅ **Solution 2: Configure Backend SSL Certificates**

### **For .NET Core Backend:**
1. **Generate Development Certificate:**
   ```bash
   dotnet dev-certs https --clean
   dotnet dev-certs https --trust
   ```

2. **Configure appsettings.json:**
   ```json
   {
     "Kestrel": {
       "Endpoints": {
         "Https": {
           "Url": "https://localhost:7230",
           "Certificate": {
             "Path": "path/to/your/certificate.pfx",
             "Password": "your-password"
           }
         }
       }
     }
   }
   ```

### **For Node.js Backend:**
1. **Generate SSL Certificate:**
   ```bash
   openssl req -x509 -newkey rsa:4096 -keyout key.pem -out cert.pem -days 365 -nodes
   ```

2. **Configure HTTPS Server:**
   ```javascript
   const https = require('https');
   const fs = require('fs');
   
   const options = {
     key: fs.readFileSync('key.pem'),
     cert: fs.readFileSync('cert.pem')
   };
   
   https.createServer(options, app).listen(7230);
   ```

## ✅ **Solution 3: Use HTTP for Development (Temporary)**

If you need a quick fix for development:

### **Change Environment to HTTP:**
```typescript
// src/app/Environment/environment.ts
static baseUrl: string = 'http://localhost:7230/api';
```

### **Remember to Change Back for Production:**
```typescript
// For production
static baseUrl: string = 'https://your-production-domain.com/api';
```

## 🔍 **Testing Your Setup**

### **Step 1: Test Backend Directly**
1. Visit: `https://localhost:7230/api/Category/All`
2. Should return JSON data (not an error)

### **Step 2: Test Frontend API Calls**
1. Visit: `https://localhost:54615/debug-specifications`
2. Check browser console for API responses
3. Should see successful API calls

### **Step 3: Test Comparison Feature**
1. Visit: `https://localhost:54615/pc-compare`
2. Select a category
3. Choose products
4. Check if specifications load

## 🐛 **Debugging SSL Issues**

### **Check Browser Console:**
Look for these error messages:
```
❌ Error: self-signed certificate
❌ DEPTH_ZERO_SELF_SIGNED_CERT
❌ SSL certificate error detected
```

### **Check Network Tab:**
1. Open browser DevTools
2. Go to Network tab
3. Try to load the page
4. Look for failed requests to `https://localhost:7230`

### **Common Error Messages:**
- `fetch failed` - SSL certificate issue
- `other side closed` - Backend not running
- `404 Not Found` - API endpoint doesn't exist

## 🛠️ **Backend Configuration Tips**

### **For .NET Core:**
```csharp
// Program.cs or Startup.cs
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

app.UseCors("AllowAll");
```

### **For Node.js:**
```javascript
// CORS configuration
app.use(cors({
    origin: 'https://localhost:54615',
    credentials: true
}));
```

## ✅ **Verification Checklist**

- [ ] Backend is running on `https://localhost:7230`
- [ ] Certificate is accepted in browser
- [ ] API endpoints return data when accessed directly
- [ ] Frontend can make API calls without SSL errors
- [ ] Debug page shows successful specification loading
- [ ] Comparison feature works with real data

## 🎯 **Expected Results**

When SSL is properly configured:

1. **No SSL errors** in browser console
2. **Successful API calls** to your backend
3. **Real data loading** from your database
4. **Comparison working** with actual specifications

## 🔄 **Quick Fix Commands**

### **If using .NET Core:**
```bash
dotnet dev-certs https --trust
dotnet run
```

### **If using Node.js:**
```bash
# Generate certificates
openssl req -x509 -newkey rsa:4096 -keyout key.pem -out cert.pem -days 365 -nodes
# Start server with HTTPS
node server.js
```

The key is to ensure your browser trusts the SSL certificate for `localhost:7230`. Once that's done, your Angular app will be able to make HTTPS API calls successfully! 