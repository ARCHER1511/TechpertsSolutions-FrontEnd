# Complete API Endpoints Documentation

## Overview
This document provides comprehensive information about all API endpoints used in the Techperts Solutions Frontend application, including request/response formats and authentication requirements.

## Base URL
- **Development**: `https://localhost:7230/api`
- **Production**: `https://your-domain.com/api`

## Authentication
Most endpoints require authentication via JWT token in the Authorization header:
```
Authorization: Bearer <jwt_token>
```

---

## 1. Authentication Endpoints

### POST `/api/Authentication/register`
**Description**: Register a new user with role selection

**Request Body**:
```json
{
  "FullName": "John Doe",
  "UserName": "johndoe",
  "Email": "john@example.com",
  "Address": "123 Main St, City, Country",
  "Password": "SecurePass123!",
  "ConfirmPassword": "SecurePass123!",
  "PhoneNumber": "01123456789",
  "SelectedRoles": ["Customer", "TechCompany"]
}
```

**Response**:
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "userId": "user-123",
    "email": "john@example.com",
    "roles": ["Customer", "TechCompany"]
  }
}
```

### POST `/api/Authentication/login`
**Description**: Authenticate user and return JWT token

**Request Body**:
```json
{
  "Email": "john@example.com",
  "Password": "SecurePass123!",
  "RememberMe": true
}
```

**Response**:
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "customerId": "customer-123",
    "userName": "John Doe",
    "userRoles": ["Customer", "TechCompany"],
    "userCart": {
      "id": "cart-123",
      "items": []
    }
  }
}
```

### POST `/api/Authentication/forgot-password`
**Description**: Send password reset email

**Request Body**:
```json
{
  "Email": "john@example.com"
}
```

### POST `/api/Authentication/reset-password`
**Description**: Reset password with token

**Request Body**:
```json
{
  "Token": "reset-token-123",
  "NewPassword": "NewSecurePass123!",
  "ConfirmPassword": "NewSecurePass123!"
}
```

### DELETE `/api/Authentication/delete-account`
**Description**: Delete user account

**Headers**: `Authorization: Bearer <token>`

---

## 2. Category Endpoints

### GET `/api/Category/All`
**Description**: Get all categories with products

**Response**:
```json
{
  "success": true,
  "message": "Categories retrieved successfully",
  "data": [
    {
      "id": "category-1",
      "name": "Processors",
      "description": "CPU processors",
      "imageUrl": "processors.png",
      "products": [
        {
          "id": "product-1",
          "name": "Intel Core i7",
          "price": 299.99,
          "imageUrl": "intel-i7.jpg"
        }
      ]
    }
  ]
}
```

### GET `/api/Category/GetCategory/{Id}`
**Description**: Get specific category by ID

**Response**:
```json
{
  "success": true,
  "message": "Category retrieved successfully",
  "data": {
    "id": "category-1",
    "name": "Processors",
    "description": "CPU processors",
    "imageUrl": "processors.png",
    "products": [...]
  }
}
```

### POST `/api/Category/Create`
**Description**: Create new category (Admin only)

**Request Body**:
```json
{
  "name": "New Category",
  "description": "Category description",
  "imageUrl": "category-image.png"
}
```

### PUT `/api/Category/Update/{Id}`
**Description**: Update category (Admin only)

### DELETE `/api/Category/Delete/{Id}`
**Description**: Delete category (Admin only)

---

## 3. Product Endpoints

### GET `/api/Product/all`
**Description**: Get all products with pagination

**Query Parameters**:
- `page`: Page number (default: 1)
- `pageSize`: Items per page (default: 10)
- `categoryId`: Filter by category
- `search`: Search term

**Response**:
```json
{
  "success": true,
  "message": "Products retrieved successfully",
  "data": {
    "items": [
      {
        "id": "product-1",
        "name": "Intel Core i7",
        "price": 299.99,
        "description": "High-performance processor",
        "imageUrl": "intel-i7.jpg",
        "category": "Processors",
        "techCompanyId": "tech-company-1",
        "status": "Approved",
        "stock": 50
      }
    ],
    "totalItems": 100,
    "totalPages": 10,
    "currentPage": 1
  }
}
```

### GET `/api/Product/{id}`
**Description**: Get specific product by ID

### POST `/api/Product`
**Description**: Create new product (TechCompany/Admin only)

**Request Body**:
```json
{
  "name": "New Product",
  "price": 199.99,
  "description": "Product description",
  "category": "Processors",
  "techCompanyId": "tech-company-1",
  "stock": 25,
  "specifications": [
    {
      "key": "CPU Cores",
      "value": "8"
    }
  ]
}
```

### PUT `/api/Product/{id}`
**Description**: Update product

### DELETE `/api/Product/{id}`
**Description**: Delete product

---

## 4. Cart Endpoints

### GET `/api/Cart/{customerId}`
**Description**: Get customer's cart

**Response**:
```json
{
  "success": true,
  "data": {
    "id": "cart-123",
    "customerId": "customer-123",
    "items": [
      {
        "id": "cart-item-1",
        "productId": "product-1",
        "productName": "Intel Core i7",
        "price": 299.99,
        "quantity": 2,
        "totalPrice": 599.98
      }
    ],
    "totalPrice": 599.98
  }
}
```

### POST `/api/Cart/{customerId}/items`
**Description**: Add item to cart

**Request Body**:
```json
{
  "productId": "product-1",
  "quantity": 2
}
```

### PUT `/api/Cart/{customerId}/items`
**Description**: Update cart item

### DELETE `/api/Cart/{customerId}/items/{productId}`
**Description**: Remove item from cart

### DELETE `/api/Cart/{customerId}/clear`
**Description**: Clear entire cart

### POST `/api/Cart/{customerId}/checkout`
**Description**: Checkout cart

---

## 5. Order Endpoints

### GET `/api/Orders`
**Description**: Get all orders (Admin only)

### GET `/api/Orders/by-customer/{customerId}`
**Description**: Get customer's orders

**Response**:
```json
{
  "success": true,
  "data": [
    {
      "id": "order-123",
      "customerId": "customer-123",
      "orderDate": "2024-01-15T10:30:00Z",
      "status": "Pending",
      "totalAmount": 599.98,
      "items": [...],
      "deliveryAddress": "123 Main St",
      "deliveryPersonId": "delivery-123"
    }
  ]
}
```

### POST `/api/Orders`
**Description**: Create new order

**Request Body**:
```json
{
  "customerId": "customer-123",
  "items": [
    {
      "productId": "product-1",
      "quantity": 2
    }
  ],
  "deliveryAddress": "123 Main St, City",
  "paymentMethod": "CreditCard"
}
```

---

## 6. Admin Endpoints

### GET `/api/Admins/all`
**Description**: Get all admins

### GET `/api/Admins/products/pending`
**Description**: Get pending products for approval

### POST `/api/Admins/products/{productId}/approve`
**Description**: Approve product

### POST `/api/Admins/products/{productId}/reject`
**Description**: Reject product

**Request Body**:
```json
{
  "reason": "Product description is insufficient"
}
```

### GET `/api/Admins/orders`
**Description**: Get all orders for admin review

### PUT `/api/Admins/orders/{orderId}/status`
**Description**: Update order status

**Request Body**:
```json
{
  "status": "Shipped"
}
```

### GET `/api/Admins/dashboard/stats`
**Description**: Get dashboard statistics

**Response**:
```json
{
  "success": true,
  "data": {
    "totalCustomers": 150,
    "totalOrders": 75,
    "totalRevenue": 15000.00,
    "pendingProducts": 5,
    "activeDeliveries": 12
  }
}
```

---

## 7. Tech Company Endpoints

### GET `/api/TechCompany`
**Description**: Get all tech companies

### POST `/api/TechCompany`
**Description**: Create tech company

**Request Body**:
```json
{
  "name": "Tech Solutions Inc",
  "email": "contact@techsolutions.com",
  "phone": "01123456789",
  "address": "456 Tech St, City",
  "description": "Leading technology solutions provider",
  "services": ["Hardware", "Software", "Maintenance"]
}
```

### GET `/api/TechCompany/{id}`
**Description**: Get specific tech company

### PUT `/api/TechCompany/{id}`
**Description**: Update tech company

---

## 8. Delivery Person Endpoints

### GET `/api/DeliveryPerson`
**Description**: Get all delivery persons

### POST `/api/DeliveryPerson`
**Description**: Create delivery person

**Request Body**:
```json
{
  "name": "Ahmed Ali",
  "email": "ahmed@delivery.com",
  "phone": "01123456789",
  "address": "789 Delivery St",
  "vehicleType": "Motorcycle",
  "vehicleNumber": "ABC-123"
}
```

### GET `/api/DeliveryPerson/available`
**Description**: Get available delivery persons

---

## 9. Maintenance Endpoints

### GET `/api/Maintenance`
**Description**: Get all maintenance requests

### POST `/api/Maintenance`
**Description**: Create maintenance request

**Request Body**:
```json
{
  "customerId": "customer-123",
  "description": "Computer not turning on",
  "serviceType": "Hardware Repair",
  "priority": "High",
  "address": "123 Main St, City",
  "phone": "01123456789"
}
```

### GET `/api/Maintenance/available-requests`
**Description**: Get available maintenance requests for tech companies

### POST `/api/Maintenance/{maintenanceId}/accept`
**Description**: Accept maintenance request (TechCompany only)

### POST `/api/Maintenance/{maintenanceId}/complete`
**Description**: Complete maintenance request

---

## 10. Roles Endpoints

### GET `/api/Roles/all`
**Description**: Get all available roles

### GET `/api/Roles/registration-options`
**Description**: Get roles available for registration

**Response**:
```json
{
  "success": true,
  "data": {
    "roles": [
      {
        "id": "customer",
        "name": "Customer",
        "description": "Regular customer account"
      },
      {
        "id": "techcompany",
        "name": "TechCompany",
        "description": "Technology company account"
      },
      {
        "id": "deliveryperson",
        "name": "DeliveryPerson",
        "description": "Delivery person account"
      }
    ],
    "enumValues": ["Customer", "TechCompany", "DeliveryPerson", "Admin"]
  }
}
```

### POST `/api/Roles/assign`
**Description**: Assign role to user (Admin only)

**Request Body**:
```json
{
  "userId": "user-123",
  "roleId": "techcompany"
}
```

---

## 11. Wishlist Endpoints

### GET `/api/WishList/customer/{customerId}`
**Description**: Get customer's wishlist

### POST `/api/WishList/{wishListId}/items`
**Description**: Add item to wishlist

### DELETE `/api/WishList/{wishListId}/items/{itemId}`
**Description**: Remove item from wishlist

### POST `/api/WishList/{wishListId}/move-to-cart`
**Description**: Move wishlist item to cart

---

## 12. Enums Endpoints

### GET `/api/Enums/all`
**Description**: Get all enum values

**Response**:
```json
{
  "success": true,
  "data": {
    "productCategories": ["Processors", "Motherboard", "RAM", "Storage"],
    "orderStatus": ["Pending", "Confirmed", "Shipped", "Delivered"],
    "serviceTypes": ["Hardware Repair", "Software Installation", "Maintenance"],
    "productPendingStatus": ["Pending", "Approved", "Rejected"]
  }
}
```

---

## Error Responses

All endpoints return consistent error responses:

```json
{
  "success": false,
  "message": "Error description",
  "errors": {
    "fieldName": ["Field-specific error message"]
  }
}
```

## Common HTTP Status Codes

- **200**: Success
- **201**: Created
- **400**: Bad Request
- **401**: Unauthorized
- **403**: Forbidden
- **404**: Not Found
- **500**: Internal Server Error

---

## Testing Endpoints

You can test these endpoints using:
1. **Swagger UI**: `https://localhost:7230/swagger/index.html`
2. **Postman**: Import the API collection
3. **Frontend Application**: Use the integrated API calls

## Notes

- All timestamps are in ISO 8601 format
- All monetary values are in decimal format (e.g., 299.99)
- File uploads use multipart/form-data
- Pagination uses zero-based indexing
- JWT tokens expire after 24 hours (configurable) 