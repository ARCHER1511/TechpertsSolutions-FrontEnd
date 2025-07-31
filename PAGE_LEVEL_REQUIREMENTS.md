# 🎯 Page-Level Requirements & API Endpoint Contract

## 📄 1. Page-Level Requirements (UI Components per Role)

### 1.1 Common Pages (All Users)

| Page | Purpose | Key UI Elements | Required Data (props, API) |
|------|---------|-----------------|---------------------------|
| **Login/Register** | User authentication and registration | Form, role selector, validation, dark mode toggle | Auth API |
| **Dashboard (Role-Based)** | Role-specific overview and actions | Summary boxes, role-specific widgets, quick actions | Role-specific APIs |
| **Live Chat** | Real-time communication | Chat window, user list, file upload, message history | Chat API (SignalR) |
| **Order Tracking** | Track order status and history | Status timeline, order details, delivery info | Order Status API |
| **Profile Page** | User information management | User info, edit form, preferences, dark mode settings | User API |

### 1.2 Customer Pages

| Page | Purpose | Key UI Elements | Required Data (props, API) |
|------|---------|-----------------|---------------------------|
| **Product Catalog** | Browse and search products | Filters (Category, Subcategory, Tech Company, Location), Product Cards, Search, Pagination | Product API, Category API, Tech Company API |
| **Product Details** | View detailed product information | Product images, specs, tech company info, add to cart/wishlist | Product API, Tech Company API |
| **Cart Page** | Manage shopping cart | Cart items, quantity controls, checkout button, total calculation | Cart API |
| **Checkout Page** | Complete purchase process | Order summary, delivery options, payment form | Cart API, Order API |
| **Service Request - Maintenance** | Request maintenance services | Form (upload images, select tech company, delivery option), nearest tech companies | Maintenance API, Tech Company API |
| **Service Request - PC Assembly** | Request PC assembly services | Part selector, compatibility checker, tech company selection | PCAssembly API, Product API |
| **Order History** | View past orders | Order list, status tracking, reorder functionality | Order API |
| **Wishlist** | Save favorite products | Wishlist items, add/remove functionality | Wishlist API |
| **Customer Dashboard** | Customer-specific overview | Recent orders, maintenance requests, quick actions | Order API, Maintenance API |

### 1.3 Tech Company Pages

| Page | Purpose | Key UI Elements | Required Data (props, API) |
|------|---------|-----------------|---------------------------|
| **Product Upload** | Add new products to catalog | Form (name, description, price, category, images, delivery option) | Product API, Category API, Image Upload API |
| **Product Management** | Manage company products | Product list, edit/delete actions, status updates | Product API |
| **Service Management Dashboard** | Handle maintenance/assembly requests | Request list, status update buttons, chat integration | Maintenance API, PCAssembly API |
| **Tech Company Dashboard** | Company overview and analytics | Service requests, earnings, performance metrics | Maintenance API, Commission API |
| **Commission Settings** | View and manage commission rates | Commission display, earnings history | Commission API |

### 1.4 Delivery Person Pages

| Page | Purpose | Key UI Elements | Required Data (props, API) |
|------|---------|-----------------|---------------------------|
| **Assigned Deliveries** | View and manage assigned deliveries | Order list, status update buttons, customer info | Delivery API, Order API |
| **Delivery History** | Track completed deliveries | Delivery history, earnings, performance | Delivery API |
| **Delivery Dashboard** | Delivery person overview | Active deliveries, earnings summary, quick actions | Delivery API |

### 1.5 Admin Pages

| Page | Purpose | Key UI Elements | Required Data (props, API) |
|------|---------|-----------------|---------------------------|
| **Product Approval Dashboard** | Approve/reject pending products | Product list, approve/reject buttons, product details | Product API |
| **Order Management** | Manage all orders | Order list, assign delivery, status updates | Order API, Delivery API |
| **User Management** | Manage all users | User list, activate/deactivate, role management | User Management API |
| **Commission Settings** | Configure commission rates | Commission configuration, rate management | Commission API |
| **Admin Dashboard** | System overview and analytics | System metrics, user statistics, revenue data | Admin API |

## 📦 2. API Endpoint Contract for Frontend

### 2.1 Authentication APIs

| Endpoint | Method | Request Params | Response Data Example |
|----------|--------|----------------|----------------------|
| `/api/Authentication/register` | POST | `RegisterDTO`, `role` | `{ success: true, message: "User registered", data: { token, user } }` |
| `/api/Authentication/login` | POST | `LoginDTO` | `{ success: true, message: "Login successful", data: { token, user } }` |
| `/api/Authentication/forgot-password` | POST | `ForgotPasswordDTO` | `{ success: true, message: "Reset email sent" }` |
| `/api/Authentication/reset-password` | POST | `ResetPasswordDTO` | `{ success: true, message: "Password reset" }` |
| `/api/Authentication/delete-account` | DELETE | - | `{ success: true, message: "Account deleted" }` |

### 2.2 Product APIs

| Endpoint | Method | Request Params | Response Data Example |
|----------|--------|----------------|----------------------|
| `/api/Product/all` | GET | `pageNumber`, `pageSize`, `status`, `categoryEnum`, `subCategoryName`, `search`, `sortBy`, `sortDesc` | `{ success: true, data: { products: [], totalCount: 100 } }` |
| `/api/Product/{id}` | GET | `id` | `{ success: true, data: ProductDTO }` |
| `/api/Product/pending` | GET | `pageNumber`, `pageSize`, `sortBy`, `sortDesc` | `{ success: true, data: { products: [], totalCount: 50 } }` |
| `/api/Product/category/{categoryEnum}` | GET | `categoryEnum`, `pageNumber`, `pageSize` | `{ success: true, data: { products: [], totalCount: 75 } }` |
| `/api/Product` | POST | `ProductCreateDTO`, `category`, `status` | `{ success: true, message: "Product created" }` |
| `/api/Product/{id}` | PUT | `id`, `ProductUpdateDTO` | `{ success: true, message: "Product updated" }` |
| `/api/Product/{id}` | DELETE | `id` | `{ success: true, message: "Product deleted" }` |
| `/api/Product/{productId}/upload-image` | POST | `productId`, `imageFile` | `{ success: true, message: "Image uploaded" }` |

### 2.3 Cart APIs

| Endpoint | Method | Request Params | Response Data Example |
|----------|--------|----------------|----------------------|
| `/api/Cart/{customerId}` | GET | `customerId` | `{ success: true, data: CartReadDTO }` |
| `/api/Cart/{customerId}/items` | POST | `customerId`, `CartItemDTO` | `{ success: true, message: "Item added" }` |
| `/api/Cart/{customerId}/items` | PUT | `customerId`, `CartUpdateItemQuantityDTO` | `{ success: true, message: "Quantity updated" }` |
| `/api/Cart/{customerId}/items/{productId}` | DELETE | `customerId`, `productId` | `{ success: true, message: "Item removed" }` |
| `/api/Cart/{customerId}/clear` | DELETE | `customerId` | `{ success: true, message: "Cart cleared" }` |
| `/api/Cart/{customerId}/checkout` | POST | `customerId` | `{ success: true, data: OrderReadDTO }` |
| `/api/Cart/checkout` | POST | `CartCheckoutDTO` | `{ success: true, data: OrderReadDTO }` |

### 2.4 Order APIs

| Endpoint | Method | Request Params | Response Data Example |
|----------|--------|----------------|----------------------|
| `/api/Orders/{id}` | GET | `id` | `{ success: true, data: OrderReadDTO }` |
| `/api/Orders` | GET | - | `{ success: true, data: OrderReadDTO[] }` |
| `/api/Orders/by-customer/{customerId}` | GET | `customerId` | `{ success: true, data: OrderReadDTO[] }` |
| `/api/Orders/customer/{customerId}/history` | GET | `customerId` | `{ success: true, data: OrderReadDTO[] }` |

### 2.5 Maintenance APIs

| Endpoint | Method | Request Params | Response Data Example |
|----------|--------|----------------|----------------------|
| `/api/Maintenance` | GET | - | `{ success: true, data: MaintenanceDTO[] }` |
| `/api/Maintenance/{id}` | GET | `id` | `{ success: true, data: MaintenanceDTO }` |
| `/api/Maintenance` | POST | `MaintenanceCreateDTO`, `status` | `{ success: true, message: "Maintenance created" }` |
| `/api/Maintenance/{id}` | PUT | `id`, `MaintenanceUpdateDTO` | `{ success: true, message: "Maintenance updated" }` |
| `/api/Maintenance/tech-company/{techCompanyId}` | GET | `techCompanyId` | `{ success: true, data: MaintenanceDTO[] }` |
| `/api/Maintenance/available-requests` | GET | - | `{ success: true, data: MaintenanceDTO[] }` |
| `/api/Maintenance/{maintenanceId}/accept` | POST | `maintenanceId`, `techCompanyId` | `{ success: true, message: "Request accepted" }` |
| `/api/Maintenance/{maintenanceId}/complete` | POST | `maintenanceId`, `CompleteMaintenanceRequest` | `{ success: true, message: "Maintenance completed" }` |
| `/api/Maintenance/nearest` | GET | `customerId` | `{ success: true, data: MaintenanceNearestDTO[] }` |

### 2.6 PC Assembly APIs

| Endpoint | Method | Request Params | Response Data Example |
|----------|--------|----------------|----------------------|
| `/api/PCAssembly` | POST | `PCAssemblyCreateDTO` | `{ success: true, data: PCAssemblyDTO }` |
| `/api/PCAssembly/{id}` | GET | `id` | `{ success: true, data: PCAssemblyDTO }` |
| `/api/PCAssembly` | GET | - | `{ success: true, data: PCAssemblyDTO[] }` |
| `/api/PCAssembly/customer/{customerId}` | GET | `customerId` | `{ success: true, data: PCAssemblyDTO[] }` |
| `/api/PCAssembly/build/components/{category}` | GET | `category`, `pageNumber`, `pageSize`, `search`, `sortBy`, `sortDesc` | `{ success: true, data: { products: [], totalCount: 50 } }` |
| `/api/PCAssembly/build/categories` | GET | - | `{ success: true, data: ProductCategory[] }` |
| `/api/PCAssembly/build/{assemblyId}/add-component` | POST | `assemblyId`, `AddComponentToBuildDTO` | `{ success: true, message: "Component added" }` |
| `/api/PCAssembly/build/{assemblyId}/remove-component/{itemId}` | DELETE | `assemblyId`, `itemId` | `{ success: true, message: "Component removed" }` |
| `/api/PCAssembly/build/{assemblyId}/status` | GET | `assemblyId` | `{ success: true, data: { status: "InProgress" } }` |
| `/api/PCAssembly/build/{assemblyId}/total` | GET | `assemblyId` | `{ success: true, data: { total: 1500.00 } }` |
| `/api/PCAssembly/build/compatible/{productId}` | GET | `productId` | `{ success: true, data: ProductDTO[] }` |

### 2.7 Category & Subcategory APIs

| Endpoint | Method | Request Params | Response Data Example |
|----------|--------|----------------|----------------------|
| `/api/Category` | GET | - | `{ success: true, data: CategoryDTO[] }` |
| `/api/Category/{id}` | GET | `id` | `{ success: true, data: CategoryDTO }` |
| `/api/SubCategory` | GET | - | `{ success: true, data: SubCategoryDTO[] }` |
| `/api/SubCategory/{id}` | GET | `id` | `{ success: true, data: SubCategoryDTO }` |
| `/api/SubCategory/category/{categoryId}` | GET | `categoryId` | `{ success: true, data: SubCategoryDTO[] }` |

### 2.8 Wishlist APIs

| Endpoint | Method | Request Params | Response Data Example |
|----------|--------|----------------|----------------------|
| `/api/WishList/{customerId}` | GET | `customerId` | `{ success: true, data: WishListDTO[] }` |
| `/api/WishList/{customerId}/add` | POST | `customerId`, `productId` | `{ success: true, message: "Added to wishlist" }` |
| `/api/WishList/{customerId}/remove/{productId}` | DELETE | `customerId`, `productId` | `{ success: true, message: "Removed from wishlist" }` |

### 2.9 Delivery APIs

| Endpoint | Method | Request Params | Response Data Example |
|----------|--------|----------------|----------------------|
| `/api/Delivery` | GET | - | `{ success: true, data: DeliveryDTO[] }` |
| `/api/Delivery/{id}` | GET | `id` | `{ success: true, data: DeliveryDTO }` |
| `/api/Delivery/orders/{orderId}` | GET | `orderId` | `{ success: true, data: DeliveryDTO[] }` |
| `/api/Delivery/person/{deliveryPersonId}` | GET | `deliveryPersonId` | `{ success: true, data: DeliveryDTO[] }` |
| `/api/Delivery/assign` | POST | `AssignDeliveryDTO` | `{ success: true, message: "Delivery assigned" }` |
| `/api/Delivery/{id}/status` | PUT | `id`, `status` | `{ success: true, message: "Status updated" }` |

### 2.10 Admin & User Management APIs

| Endpoint | Method | Request Params | Response Data Example |
|----------|--------|----------------|----------------------|
| `/api/Admins` | GET | - | `{ success: true, data: AdminDTO[] }` |
| `/api/Admins/{id}` | GET | `id` | `{ success: true, data: AdminDTO }` |
| `/api/UserManagement` | GET | - | `{ success: true, data: UserDTO[] }` |
| `/api/UserManagement/{id}` | GET | `id` | `{ success: true, data: UserDTO }` |
| `/api/UserManagement/{id}/activate` | PUT | `id` | `{ success: true, message: "User activated" }` |
| `/api/UserManagement/{id}/deactivate` | PUT | `id` | `{ success: true, message: "User deactivated" }` |

### 2.11 Commission APIs

| Endpoint | Method | Request Params | Response Data Example |
|----------|--------|----------------|----------------------|
| `/api/Commission` | GET | - | `{ success: true, data: CommissionDTO[] }` |
| `/api/Commission/{id}` | GET | `id` | `{ success: true, data: CommissionDTO }` |
| `/api/Commission/tech-company/{techCompanyId}` | GET | `techCompanyId` | `{ success: true, data: CommissionDTO[] }` |
| `/api/Commission` | POST | `CommissionCreateDTO` | `{ success: true, message: "Commission created" }` |
| `/api/Commission/{id}` | PUT | `id`, `CommissionUpdateDTO` | `{ success: true, message: "Commission updated" }` |

### 2.12 Notification APIs

| Endpoint | Method | Request Params | Response Data Example |
|----------|--------|----------------|----------------------|
| `/api/Notification` | GET | - | `{ success: true, data: NotificationDTO[] }` |
| `/api/Notification/{id}` | GET | `id` | `{ success: true, data: NotificationDTO }` |
| `/api/Notification/user/{userId}` | GET | `userId` | `{ success: true, data: NotificationDTO[] }` |
| `/api/Notification` | POST | `NotificationCreateDTO` | `{ success: true, message: "Notification sent" }` |
| `/api/Notification/{id}/mark-read` | PUT | `id` | `{ success: true, message: "Marked as read" }` |

### 2.13 Image Upload APIs

| Endpoint | Method | Request Params | Response Data Example |
|----------|--------|----------------|----------------------|
| `/api/ImageUpload/upload` | POST | `imageFile` | `{ success: true, data: { imageUrl: "url" } }` |
| `/api/ImageUpload/delete` | DELETE | `imageUrl` | `{ success: true, message: "Image deleted" }` |

## 🎨 3. Styling Guidelines

### 3.1 Dark Mode Implementation
- Use CSS variables for color theming
- Implement smooth transitions between light/dark modes
- Follow existing navbar styling patterns
- Use Bootstrap classes with custom CSS overrides

### 3.2 Component Styling
- Maintain consistency with existing components
- Use modern card designs with shadows and rounded corners
- Implement responsive design for all screen sizes
- Use gradient backgrounds and glass-morphism effects where appropriate

### 3.3 Color Scheme
- **Primary**: #0d6efd (Bootstrap blue)
- **Secondary**: #6c757d (Bootstrap gray)
- **Success**: #198754 (Bootstrap green)
- **Warning**: #ffc107 (Bootstrap yellow)
- **Danger**: #dc3545 (Bootstrap red)
- **Dark Mode Background**: #212529
- **Dark Mode Text**: #ffffff

## 🔧 4. Implementation Notes

### 4.1 Authentication Flow
- JWT token-based authentication
- Role-based access control
- Automatic token refresh
- Secure logout with token cleanup

### 4.2 Error Handling
- Consistent error response format
- User-friendly error messages
- Loading states for all API calls
- Retry mechanisms for failed requests

### 4.3 Performance Optimization
- Lazy loading for components
- Image optimization and lazy loading
- Caching strategies for API responses
- Pagination for large data sets

### 4.4 Security Considerations
- Input validation on frontend and backend
- XSS protection
- CSRF protection
- Secure file upload handling 