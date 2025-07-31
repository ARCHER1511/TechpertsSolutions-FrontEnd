-- TechpertsSolutions Sample Data Insert Script
-- This script inserts sample data into existing tables
-- Based on the latest migration: 20250731001926_LiveChat

-- =============================================
-- 1. INSERT SAMPLE ROLES
-- =============================================
INSERT INTO AspNetRoles (Id, Name, NormalizedName, ConcurrencyStamp, Notes)
VALUES 
    (NEWID(), 'Customer', 'CUSTOMER', NEWID(), 'Regular customer role'),
    (NEWID(), 'Admin', 'ADMIN', NEWID(), 'System administrator role'),
    (NEWID(), 'Tech Company', 'TECH COMPANY', NEWID(), 'Technology company role'),
    (NEWID(), 'Delivery Person', 'DELIVERY PERSON', NEWID(), 'Delivery personnel role');

-- =============================================
-- 2. INSERT SAMPLE USERS
-- =============================================
INSERT INTO AspNetUsers (Id, UserName, NormalizedUserName, Email, NormalizedEmail, EmailConfirmed, PasswordHash, SecurityStamp, ConcurrencyStamp, PhoneNumber, PhoneNumberConfirmed, TwoFactorEnabled, LockoutEnd, LockoutEnabled, AccessFailedCount, FullName, Address, City, Country, PostalCode, Latitude, Longitude, CreatedAt, UpdatedAt)
VALUES 
    (NEWID(), 'admin', 'ADMIN', 'admin@techperts.com', 'ADMIN@TECHPERTS.COM', 1, 'AQAAAAIAAYagAAAAELbHvL0Zx3Du/0a9AiDN/9aNu4F8MrZx4Ac8vsKvooQ=', NEWID(), NEWID(), '+1234567890', 1, 0, NULL, 1, 0, 'System Administrator', '123 Admin St', 'Tech City', 'Tech Country', '12345', 40.7128, -74.0060, GETDATE(), NULL),
    (NEWID(), 'customer1', 'CUSTOMER1', 'customer1@example.com', 'CUSTOMER1@EXAMPLE.COM', 1, 'AQAAAAIAAYagAAAAELbHvL0Zx3Du/0a9AiDN/9aNu4F8MrZx4Ac8vsKvooQ=', NEWID(), NEWID(), '+1234567891', 1, 0, NULL, 1, 0, 'John Customer', '456 Customer Ave', 'Customer City', 'Customer Country', '67890', 40.7589, -73.9851, GETDATE(), NULL),
    (NEWID(), 'techcompany1', 'TECHCOMPANY1', 'tech1@example.com', 'TECH1@EXAMPLE.COM', 1, 'AQAAAAIAAYagAAAAELbHvL0Zx3Du/0a9AiDN/9aNu4F8MrZx4Ac8vsKvooQ=', NEWID(), NEWID(), '+1234567892', 1, 0, NULL, 1, 0, 'Tech Solutions Inc', '789 Tech Blvd', 'Tech City', 'Tech Country', '11111', 40.7505, -73.9934, GETDATE(), NULL),
    (NEWID(), 'delivery1', 'DELIVERY1', 'delivery1@example.com', 'DELIVERY1@EXAMPLE.COM', 1, 'AQAAAAIAAYagAAAAELbHvL0Zx3Du/0a9AiDN/9aNu4F8MrZx4Ac8vsKvooQ=', NEWID(), NEWID(), '+1234567893', 1, 0, NULL, 1, 0, 'Mike Delivery', '321 Delivery Rd', 'Delivery City', 'Delivery Country', '22222', 40.7549, -73.9840, GETDATE(), NULL);

-- =============================================
-- 3. INSERT SAMPLE COMMISSION PLANS
-- =============================================
INSERT INTO CommissionPlan (Id, Name, Description, ProductSaleCommission, MaintenanceCommission, PCAssemblyCommission, DeliveryCommission, MonthlySubscriptionFee, IsActive, IsDefault, CreatedAt, UpdatedAt)
VALUES 
    (NEWID(), 'Basic Plan', 'Basic commission plan for new companies', 5.00, 10.00, 8.00, 3.00, 50.00, 1, 1, GETDATE(), NULL),
    (NEWID(), 'Premium Plan', 'Premium commission plan with higher rates', 8.00, 15.00, 12.00, 5.00, 100.00, 1, 0, GETDATE(), NULL),
    (NEWID(), 'Enterprise Plan', 'Enterprise plan for large companies', 10.00, 20.00, 15.00, 7.00, 200.00, 1, 0, GETDATE(), NULL);

-- =============================================
-- 4. INSERT SAMPLE CATEGORIES
-- =============================================
INSERT INTO Categories (Id, Name, Description, Image)
VALUES 
    (NEWID(), 'Processor', 'CPU processors for computers', NULL),
    (NEWID(), 'Motherboard', 'Computer motherboards', NULL),
    (NEWID(), 'CPU Cooler', 'CPU cooling solutions', NULL),
    (NEWID(), 'Case', 'Computer cases and enclosures', NULL),
    (NEWID(), 'Graphics Card', 'GPU and graphics cards', NULL),
    (NEWID(), 'RAM', 'Memory modules', NULL),
    (NEWID(), 'Storage', 'Hard drives and SSDs', NULL),
    (NEWID(), 'Case Cooler', 'Case cooling fans', NULL),
    (NEWID(), 'Power Supply', 'Power supply units', NULL),
    (NEWID(), 'Monitor', 'Computer monitors and displays', NULL),
    (NEWID(), 'Accessories', 'Computer accessories', NULL),
    (NEWID(), 'Pre-Build PC', 'Pre-assembled computers', NULL),
    (NEWID(), 'Laptop', 'Laptop computers', NULL);

-- =============================================
-- 5. INSERT SAMPLE SUB-CATEGORIES
-- =============================================
INSERT INTO SubCategories (Id, Name, CategoryId, Image)
SELECT 
    NEWID(),
    'Intel Processors',
    c.Id,
    NULL
FROM Categories c WHERE c.Name = 'Processor'

UNION ALL

SELECT 
    NEWID(),
    'AMD Processors',
    c.Id,
    NULL
FROM Categories c WHERE c.Name = 'Processor'

UNION ALL

SELECT 
    NEWID(),
    'ATX Motherboards',
    c.Id,
    NULL
FROM Categories c WHERE c.Name = 'Motherboard'

UNION ALL

SELECT 
    NEWID(),
    'Micro-ATX Motherboards',
    c.Id,
    NULL
FROM Categories c WHERE c.Name = 'Motherboard'

UNION ALL

SELECT 
    NEWID(),
    'Air Coolers',
    c.Id,
    NULL
FROM Categories c WHERE c.Name = 'CPU Cooler'

UNION ALL

SELECT 
    NEWID(),
    'Liquid Coolers',
    c.Id,
    NULL
FROM Categories c WHERE c.Name = 'CPU Cooler';

-- =============================================
-- 6. INSERT SAMPLE ENTITY RECORDS
-- =============================================

-- Get role IDs for reference
DECLARE @CustomerRoleId NVARCHAR(450) = (SELECT Id FROM AspNetRoles WHERE Name = 'Customer');
DECLARE @AdminRoleId NVARCHAR(450) = (SELECT Id FROM AspNetRoles WHERE Name = 'Admin');
DECLARE @TechCompanyRoleId NVARCHAR(450) = (SELECT Id FROM AspNetRoles WHERE Name = 'Tech Company');
DECLARE @DeliveryPersonRoleId NVARCHAR(450) = (SELECT Id FROM AspNetRoles WHERE Name = 'Delivery Person');

-- Get user IDs for reference
DECLARE @AdminUserId NVARCHAR(450) = (SELECT Id FROM AspNetUsers WHERE UserName = 'admin');
DECLARE @CustomerUserId NVARCHAR(450) = (SELECT Id FROM AspNetUsers WHERE UserName = 'customer1');
DECLARE @TechCompanyUserId NVARCHAR(450) = (SELECT Id FROM AspNetUsers WHERE UserName = 'techcompany1');
DECLARE @DeliveryUserId NVARCHAR(450) = (SELECT Id FROM AspNetUsers WHERE UserName = 'delivery1');

-- Get commission plan ID
DECLARE @BasicPlanId NVARCHAR(450) = (SELECT Id FROM CommissionPlan WHERE Name = 'Basic Plan');

-- Insert Admin
INSERT INTO Admins (Id, UserId, RoleId)
VALUES (NEWID(), @AdminUserId, @AdminRoleId);

-- Insert Customer
INSERT INTO Customers (Id, UserId, RoleId)
VALUES (NEWID(), @CustomerUserId, @CustomerRoleId);

-- Insert Tech Company
INSERT INTO TechCompanies (Id, UserId, RoleId, Address, City, Country, PostalCode, PhoneNumber, Website, Description, IsActive, Latitude, Longitude, CommissionPlanId)
VALUES (NEWID(), @TechCompanyUserId, @TechCompanyRoleId, '789 Tech Blvd', 'Tech City', 'Tech Country', '11111', '+1234567892', 'https://techsolutions.com', 'Leading technology solutions provider', 1, 40.7505, -73.9934, @BasicPlanId);

-- Insert Delivery Person
INSERT INTO DeliveryPersons (Id, UserId, RoleId, VehicleType, VehicleNumber, IsAvailable)
VALUES (NEWID(), @DeliveryUserId, @DeliveryPersonRoleId, 'Motorcycle', 'DL-12345', 1);

-- =============================================
-- 7. INSERT SAMPLE PRODUCTS
-- =============================================

-- Get category and tech company IDs
DECLARE @ProcessorCategoryId NVARCHAR(450) = (SELECT Id FROM Categories WHERE Name = 'Processor');
DECLARE @MotherboardCategoryId NVARCHAR(450) = (SELECT Id FROM Categories WHERE Name = 'Motherboard');
DECLARE @GraphicsCardCategoryId NVARCHAR(450) = (SELECT Id FROM Categories WHERE Name = 'Graphics Card');
DECLARE @TechCompanyId NVARCHAR(450) = (SELECT Id FROM TechCompanies WHERE UserId = @TechCompanyUserId);

-- Get sub-category IDs
DECLARE @IntelProcessorsId NVARCHAR(450) = (SELECT Id FROM SubCategories WHERE Name = 'Intel Processors');
DECLARE @ATXMotherboardsId NVARCHAR(450) = (SELECT Id FROM SubCategories WHERE Name = 'ATX Motherboards');

INSERT INTO Products (Id, Name, Description, Price, DiscountPrice, Stock, ImageUrl, CategoryId, SubCategoryId, TechCompanyId, status)
VALUES 
    (NEWID(), 'Intel Core i7-12700K', '12th Gen Intel Core i7 processor with 12 cores', 399.99, 379.99, 50, 'intel-i7-12700k.jpg', @ProcessorCategoryId, @IntelProcessorsId, @TechCompanyId, 1),
    (NEWID(), 'Intel Core i5-12600K', '12th Gen Intel Core i5 processor with 10 cores', 289.99, 269.99, 75, 'intel-i5-12600k.jpg', @ProcessorCategoryId, @IntelProcessorsId, @TechCompanyId, 1),
    (NEWID(), 'ASUS ROG STRIX B660-F', 'ATX motherboard for 12th Gen Intel processors', 199.99, NULL, 30, 'asus-rog-strix-b660f.jpg', @MotherboardCategoryId, @ATXMotherboardsId, @TechCompanyId, 1),
    (NEWID(), 'NVIDIA RTX 4070', 'NVIDIA GeForce RTX 4070 graphics card', 599.99, 579.99, 25, 'nvidia-rtx-4070.jpg', @GraphicsCardCategoryId, NULL, @TechCompanyId, 1),
    (NEWID(), 'AMD RX 6800 XT', 'AMD Radeon RX 6800 XT graphics card', 649.99, 629.99, 20, 'amd-rx-6800xt.jpg', @GraphicsCardCategoryId, NULL, @TechCompanyId, 1);

-- =============================================
-- 8. INSERT SAMPLE CART AND WISHLIST
-- =============================================

-- Get customer ID
DECLARE @CustomerId NVARCHAR(450) = (SELECT Id FROM Customers WHERE UserId = @CustomerUserId);

-- Insert Cart
INSERT INTO Carts (Id, CustomerId)
VALUES (NEWID(), @CustomerId);

-- Insert WishList
INSERT INTO WishLists (Id, CustomerId)
VALUES (NEWID(), @CustomerId);

-- =============================================
-- 9. INSERT SAMPLE CART ITEMS
-- =============================================

-- Get cart and product IDs
DECLARE @CartId NVARCHAR(450) = (SELECT Id FROM Carts WHERE CustomerId = @CustomerId);
DECLARE @IntelI7ProductId NVARCHAR(450) = (SELECT Id FROM Products WHERE Name = 'Intel Core i7-12700K');
DECLARE @RTX4070ProductId NVARCHAR(450) = (SELECT Id FROM Products WHERE Name = 'NVIDIA RTX 4070');

INSERT INTO CartItems (Id, CartId, ProductId, Quantity)
VALUES 
    (NEWID(), @CartId, @IntelI7ProductId, 1),
    (NEWID(), @CartId, @RTX4070ProductId, 1);

-- =============================================
-- 10. INSERT SAMPLE WISHLIST ITEMS
-- =============================================

-- Get wishlist ID
DECLARE @WishListId NVARCHAR(450) = (SELECT Id FROM WishLists WHERE CustomerId = @CustomerId);
DECLARE @IntelI5ProductId NVARCHAR(450) = (SELECT Id FROM Products WHERE Name = 'Intel Core i5-12600K');

INSERT INTO WishListItems (Id, WishListId, ProductId)
VALUES (NEWID(), @WishListId, @IntelI5ProductId);

-- =============================================
-- 11. INSERT SAMPLE ORDERS
-- =============================================

-- Create OrderHistory first
INSERT INTO OrderHistory (Id, CreatedAt, UpdatedAt)
VALUES (NEWID(), GETDATE(), NULL);

DECLARE @OrderHistoryId NVARCHAR(450) = (SELECT Id FROM OrderHistory WHERE CreatedAt = (SELECT MAX(CreatedAt) FROM OrderHistory));

-- Insert Order
INSERT INTO Orders (Id, CustomerId, OrderDate, TotalAmount, Status, OrderHistoryId, ServiceUsageId)
VALUES (NEWID(), @CustomerId, GETDATE(), 979.98, 1, @OrderHistoryId, NULL);

DECLARE @OrderId NVARCHAR(450) = (SELECT Id FROM Orders WHERE CustomerId = @CustomerId);

-- Insert Order Items
INSERT INTO OrderItems (Id, OrderId, ProductId, Quantity, UnitPrice, ItemTotal)
VALUES 
    (NEWID(), @OrderId, @IntelI7ProductId, 1, 379.99, 379.99),
    (NEWID(), @OrderId, @RTX4070ProductId, 1, 579.99, 579.99);

-- =============================================
-- 12. INSERT SAMPLE DELIVERY
-- =============================================

-- Get delivery person ID
DECLARE @DeliveryPersonId NVARCHAR(450) = (SELECT Id FROM DeliveryPersons WHERE UserId = @DeliveryUserId);

INSERT INTO Deliveries (Id, CustomerId, DeliveryPersonId, OrderId, DeliveryAddress, PickupAddress, DeliveryFee, EstimatedDeliveryDate, ActualDeliveryDate, Status, TrackingNumber, CustomerName, CustomerPhone, Notes)
VALUES (NEWID(), @CustomerId, @DeliveryPersonId, @OrderId, '456 Customer Ave, Customer City', '789 Tech Blvd, Tech City', 15.00, DATEADD(day, 3, GETDATE()), NULL, 1, 'TRK123456789', 'John Customer', '+1234567891', 'Handle with care - fragile items');

-- =============================================
-- 13. INSERT SAMPLE MAINTENANCE
-- =============================================

INSERT INTO Maintenances (Id, CustomerId, TechCompanyId, DeviceType, Issue, Priority, ServiceFee, Status, Notes, CompletedDate, DeviceImages, WarrantyId)
VALUES (NEWID(), @CustomerId, @TechCompanyId, 'Laptop', 'Overheating issue', 'High', 75.00, 1, 'Laptop running hot during gaming', NULL, 'laptop-overheating.jpg', NULL);

-- =============================================
-- 14. INSERT SAMPLE SERVICE USAGE
-- =============================================

-- Get maintenance ID
DECLARE @MaintenanceId NVARCHAR(450) = (SELECT Id FROM Maintenances WHERE CustomerId = @CustomerId);

INSERT INTO ServiceUsages (Id, MaintenanceId, ServiceType, UsedOn, CallCount)
VALUES (NEWID(), @MaintenanceId, 'Technical Support', GETDATE(), 1);

-- =============================================
-- 15. INSERT SAMPLE PC ASSEMBLY
-- =============================================

-- Get service usage ID
DECLARE @ServiceUsageId NVARCHAR(450) = (SELECT Id FROM ServiceUsages WHERE MaintenanceId = @MaintenanceId);

INSERT INTO PCAssemblies (Id, CustomerId, TechCompanyId, ServiceUsageId, Name, Description, Budget, AssemblyFee, Status, CompletedDate)
VALUES (NEWID(), @CustomerId, @TechCompanyId, @ServiceUsageId, 'Gaming PC Build', 'High-performance gaming computer assembly', 2000.00, 150.00, 1, NULL);

-- =============================================
-- 16. INSERT SAMPLE PC ASSEMBLY ITEMS
-- =============================================

-- Get PC assembly ID
DECLARE @PCAssemblyId NVARCHAR(450) = (SELECT Id FROM PCAssemblies WHERE CustomerId = @CustomerId);

INSERT INTO PCAssemblyItems (Id, PCAssemblyId, ProductId, Quantity, Price, Total, IsAssembled)
VALUES 
    (NEWID(), @PCAssemblyId, @IntelI7ProductId, 1, 379.99, 379.99, 0),
    (NEWID(), @PCAssemblyId, @RTX4070ProductId, 1, 579.99, 579.99, 0);

-- =============================================
-- 17. INSERT SAMPLE SPECIFICATIONS
-- =============================================

INSERT INTO Specifications (Id, ProductId, [Key], Value)
VALUES 
    (NEWID(), @IntelI7ProductId, 'Cores', '12'),
    (NEWID(), @IntelI7ProductId, 'Threads', '20'),
    (NEWID(), @IntelI7ProductId, 'Base Clock', '3.6 GHz'),
    (NEWID(), @IntelI7ProductId, 'Max Turbo', '5.0 GHz'),
    (NEWID(), @RTX4070ProductId, 'Memory', '12 GB GDDR6X'),
    (NEWID(), @RTX4070ProductId, 'Memory Bus', '192-bit'),
    (NEWID(), @RTX4070ProductId, 'Boost Clock', '2.48 GHz');

-- =============================================
-- 18. INSERT SAMPLE WARRANTIES
-- =============================================

INSERT INTO Warranties (Id, ProductId, Description, StartDate, EndDate)
VALUES 
    (NEWID(), @IntelI7ProductId, '3-year manufacturer warranty', GETDATE(), DATEADD(year, 3, GETDATE())),
    (NEWID(), @RTX4070ProductId, '3-year manufacturer warranty', GETDATE(), DATEADD(year, 3, GETDATE()));

-- =============================================
-- 19. INSERT SAMPLE NOTIFICATIONS
-- =============================================

INSERT INTO Notifications (Id, ReceiverId, ReceiverUserId, Message, Type, IsRead, RelatedEntityType, RelatedEntityId)
VALUES 
    (NEWID(), @CustomerUserId, @CustomerUserId, 'Your order has been confirmed and is being processed.', 1, 0, 'Order', @OrderId),
    (NEWID(), @CustomerUserId, @CustomerUserId, 'Your delivery is scheduled for tomorrow.', 2, 0, 'Delivery', @OrderId),
    (NEWID(), @TechCompanyUserId, @TechCompanyUserId, 'New maintenance request received.', 3, 0, 'Maintenance', @MaintenanceId);

-- =============================================
-- 20. INSERT USER ROLES
-- =============================================

INSERT INTO AspNetUserRoles (UserId, RoleId)
VALUES 
    (@AdminUserId, @AdminRoleId),
    (@CustomerUserId, @CustomerRoleId),
    (@TechCompanyUserId, @TechCompanyRoleId),
    (@DeliveryUserId, @DeliveryPersonRoleId);

PRINT 'Sample data insertion completed successfully!';
PRINT 'Total records inserted:';
PRINT '- Roles: 4';
PRINT '- Users: 4';
PRINT '- Commission Plans: 3';
PRINT '- Categories: 13';
PRINT '- Sub-Categories: 6';
PRINT '- Entity Records: 4';
PRINT '- Products: 5';
PRINT '- Cart & WishList: 2';
PRINT '- Cart Items: 2';
PRINT '- WishList Items: 1';
PRINT '- Orders: 1';
PRINT '- Order Items: 2';
PRINT '- Deliveries: 1';
PRINT '- Maintenances: 1';
PRINT '- Service Usages: 1';
PRINT '- PC Assemblies: 1';
PRINT '- PC Assembly Items: 2';
PRINT '- Specifications: 7';
PRINT '- Warranties: 2';
PRINT '- Notifications: 3';
PRINT '- User Roles: 4'; 