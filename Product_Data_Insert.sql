-- TechpertsSolutions Product Data Insert Script
-- This script safely inserts product data and related information
-- Handles existing data and avoids duplicates

-- =============================================
-- 1. SAFELY INSERT CATEGORIES (if not exists)
-- =============================================
IF NOT EXISTS (SELECT 1 FROM Categories WHERE Name = 'Processor')
    INSERT INTO Categories (Id, Name, Description, Image) VALUES (NEWID(), 'Processor', 'CPU processors for computers', NULL);

IF NOT EXISTS (SELECT 1 FROM Categories WHERE Name = 'Motherboard')
    INSERT INTO Categories (Id, Name, Description, Image) VALUES (NEWID(), 'Motherboard', 'Computer motherboards', NULL);

IF NOT EXISTS (SELECT 1 FROM Categories WHERE Name = 'CPU Cooler')
    INSERT INTO Categories (Id, Name, Description, Image) VALUES (NEWID(), 'CPU Cooler', 'CPU cooling solutions', NULL);

IF NOT EXISTS (SELECT 1 FROM Categories WHERE Name = 'Case')
    INSERT INTO Categories (Id, Name, Description, Image) VALUES (NEWID(), 'Case', 'Computer cases and enclosures', NULL);

IF NOT EXISTS (SELECT 1 FROM Categories WHERE Name = 'Graphics Card')
    INSERT INTO Categories (Id, Name, Description, Image) VALUES (NEWID(), 'Graphics Card', 'GPU and graphics cards', NULL);

IF NOT EXISTS (SELECT 1 FROM Categories WHERE Name = 'RAM')
    INSERT INTO Categories (Id, Name, Description, Image) VALUES (NEWID(), 'RAM', 'Memory modules', NULL);

IF NOT EXISTS (SELECT 1 FROM Categories WHERE Name = 'Storage')
    INSERT INTO Categories (Id, Name, Description, Image) VALUES (NEWID(), 'Storage', 'Hard drives and SSDs', NULL);

IF NOT EXISTS (SELECT 1 FROM Categories WHERE Name = 'Case Cooler')
    INSERT INTO Categories (Id, Name, Description, Image) VALUES (NEWID(), 'Case Cooler', 'Case cooling fans', NULL);

IF NOT EXISTS (SELECT 1 FROM Categories WHERE Name = 'Power Supply')
    INSERT INTO Categories (Id, Name, Description, Image) VALUES (NEWID(), 'Power Supply', 'Power supply units', NULL);

IF NOT EXISTS (SELECT 1 FROM Categories WHERE Name = 'Monitor')
    INSERT INTO Categories (Id, Name, Description, Image) VALUES (NEWID(), 'Monitor', 'Computer monitors and displays', NULL);

IF NOT EXISTS (SELECT 1 FROM Categories WHERE Name = 'Accessories')
    INSERT INTO Categories (Id, Name, Description, Image) VALUES (NEWID(), 'Accessories', 'Computer accessories', NULL);

IF NOT EXISTS (SELECT 1 FROM Categories WHERE Name = 'Pre-Build PC')
    INSERT INTO Categories (Id, Name, Description, Image) VALUES (NEWID(), 'Pre-Build PC', 'Pre-assembled computers', NULL);

IF NOT EXISTS (SELECT 1 FROM Categories WHERE Name = 'Laptop')
    INSERT INTO Categories (Id, Name, Description, Image) VALUES (NEWID(), 'Laptop', 'Laptop computers', NULL);

-- =============================================
-- 2. SAFELY INSERT SUB-CATEGORIES (if not exists)
-- =============================================
DECLARE @ProcessorCategoryId NVARCHAR(450) = (SELECT TOP 1 Id FROM Categories WHERE Name = 'Processor');
DECLARE @MotherboardCategoryId NVARCHAR(450) = (SELECT TOP 1 Id FROM Categories WHERE Name = 'Motherboard');
DECLARE @CPUCoolerCategoryId NVARCHAR(450) = (SELECT TOP 1 Id FROM Categories WHERE Name = 'CPU Cooler');

IF NOT EXISTS (SELECT 1 FROM SubCategories WHERE Name = 'Intel Processors' AND CategoryId = @ProcessorCategoryId)
    INSERT INTO SubCategories (Id, Name, CategoryId, Image) VALUES (NEWID(), 'Intel Processors', @ProcessorCategoryId, NULL);

IF NOT EXISTS (SELECT 1 FROM SubCategories WHERE Name = 'AMD Processors' AND CategoryId = @ProcessorCategoryId)
    INSERT INTO SubCategories (Id, Name, CategoryId, Image) VALUES (NEWID(), 'AMD Processors', @ProcessorCategoryId, NULL);

IF NOT EXISTS (SELECT 1 FROM SubCategories WHERE Name = 'ATX Motherboards' AND CategoryId = @MotherboardCategoryId)
    INSERT INTO SubCategories (Id, Name, CategoryId, Image) VALUES (NEWID(), 'ATX Motherboards', @MotherboardCategoryId, NULL);

IF NOT EXISTS (SELECT 1 FROM SubCategories WHERE Name = 'Micro-ATX Motherboards' AND CategoryId = @MotherboardCategoryId)
    INSERT INTO SubCategories (Id, Name, CategoryId, Image) VALUES (NEWID(), 'Micro-ATX Motherboards', @MotherboardCategoryId, NULL);

IF NOT EXISTS (SELECT 1 FROM SubCategories WHERE Name = 'Air Coolers' AND CategoryId = @CPUCoolerCategoryId)
    INSERT INTO SubCategories (Id, Name, CategoryId, Image) VALUES (NEWID(), 'Air Coolers', @CPUCoolerCategoryId, NULL);

IF NOT EXISTS (SELECT 1 FROM SubCategories WHERE Name = 'Liquid Coolers' AND CategoryId = @CPUCoolerCategoryId)
    INSERT INTO SubCategories (Id, Name, CategoryId, Image) VALUES (NEWID(), 'Liquid Coolers', @CPUCoolerCategoryId, NULL);

-- =============================================
-- 3. GET OR CREATE A TECH COMPANY
-- =============================================
DECLARE @TechCompanyId NVARCHAR(450);

-- Try to get existing tech company
SELECT TOP 1 @TechCompanyId = Id FROM TechCompanies;

-- If no tech company exists, create one with a default user
IF @TechCompanyId IS NULL
BEGIN
    -- Create a default user for tech company
    DECLARE @TechCompanyUserId NVARCHAR(450) = NEWID();
    
    INSERT INTO AspNetUsers (Id, UserName, NormalizedUserName, Email, NormalizedEmail, EmailConfirmed, PasswordHash, SecurityStamp, ConcurrencyStamp, PhoneNumber, PhoneNumberConfirmed, TwoFactorEnabled, LockoutEnd, LockoutEnabled, AccessFailedCount, FullName, Address, City, Country, PostalCode, Latitude, Longitude, CreatedAt, UpdatedAt)
    VALUES (@TechCompanyUserId, 'techcompany', 'TECHCOMPANY', 'tech@example.com', 'TECH@EXAMPLE.COM', 1, 'AQAAAAIAAYagAAAAELbHvL0Zx3Du/0a9AiDN/9aNu4F8MrZx4Ac8vsKvooQ=', NEWID(), NEWID(), '+1234567890', 1, 0, NULL, 1, 0, 'Tech Solutions Inc', '789 Tech Blvd', 'Tech City', 'Tech Country', '11111', 40.7505, -73.9934, GETDATE(), NULL);
    
    -- Get or create role
    DECLARE @TechCompanyRoleId NVARCHAR(450) = (SELECT TOP 1 Id FROM AspNetRoles WHERE Name = 'Tech Company');
    IF @TechCompanyRoleId IS NULL
    BEGIN
        INSERT INTO AspNetRoles (Id, Name, NormalizedName, ConcurrencyStamp, Notes)
        VALUES (NEWID(), 'Tech Company', 'TECH COMPANY', NEWID(), 'Technology company role');
        SET @TechCompanyRoleId = (SELECT TOP 1 Id FROM AspNetRoles WHERE Name = 'Tech Company');
    END
    
    -- Create tech company
    INSERT INTO TechCompanies (Id, UserId, RoleId, Address, City, Country, PostalCode, PhoneNumber, Website, Description, IsActive, Latitude, Longitude, CommissionPlanId)
    VALUES (NEWID(), @TechCompanyUserId, @TechCompanyRoleId, '789 Tech Blvd', 'Tech City', 'Tech Country', '11111', '+1234567890', 'https://techsolutions.com', 'Leading technology solutions provider', 1, 40.7505, -73.9934, NULL);
    
    SET @TechCompanyId = (SELECT TOP 1 Id FROM TechCompanies WHERE UserId = @TechCompanyUserId);
END

-- =============================================
-- 4. INSERT SAMPLE PRODUCTS
-- =============================================

-- Get additional category IDs (reusing existing variables where possible)
DECLARE @GraphicsCardCategoryId NVARCHAR(450) = (SELECT TOP 1 Id FROM Categories WHERE Name = 'Graphics Card');
DECLARE @RAMCategoryId NVARCHAR(450) = (SELECT TOP 1 Id FROM Categories WHERE Name = 'RAM');
DECLARE @StorageCategoryId NVARCHAR(450) = (SELECT TOP 1 Id FROM Categories WHERE Name = 'Storage');
DECLARE @PowerSupplyCategoryId NVARCHAR(450) = (SELECT TOP 1 Id FROM Categories WHERE Name = 'Power Supply');
DECLARE @MonitorCategoryId NVARCHAR(450) = (SELECT TOP 1 Id FROM Categories WHERE Name = 'Monitor');
DECLARE @CaseCategoryId NVARCHAR(450) = (SELECT TOP 1 Id FROM Categories WHERE Name = 'Case');

-- Get sub-category IDs
DECLARE @IntelProcessorsId NVARCHAR(450) = (SELECT TOP 1 Id FROM SubCategories WHERE Name = 'Intel Processors');
DECLARE @AMDProcessorsId NVARCHAR(450) = (SELECT TOP 1 Id FROM SubCategories WHERE Name = 'AMD Processors');
DECLARE @ATXMotherboardsId NVARCHAR(450) = (SELECT TOP 1 Id FROM SubCategories WHERE Name = 'ATX Motherboards');

-- Insert Products (only if they don't exist)
IF NOT EXISTS (SELECT 1 FROM Products WHERE Name = 'Intel Core i7-12700K')
    INSERT INTO Products (Id, Name, Description, Price, DiscountPrice, Stock, ImageUrl, CategoryId, SubCategoryId, TechCompanyId, status)
    VALUES (NEWID(), 'Intel Core i7-12700K', '12th Gen Intel Core i7 processor with 12 cores and 20 threads', 399.99, 379.99, 50, 'intel-i7-12700k.jpg', @ProcessorCategoryId, @IntelProcessorsId, @TechCompanyId, 1);

IF NOT EXISTS (SELECT 1 FROM Products WHERE Name = 'Intel Core i5-12600K')
    INSERT INTO Products (Id, Name, Description, Price, DiscountPrice, Stock, ImageUrl, CategoryId, SubCategoryId, TechCompanyId, status)
    VALUES (NEWID(), 'Intel Core i5-12600K', '12th Gen Intel Core i5 processor with 10 cores and 16 threads', 289.99, 269.99, 75, 'intel-i5-12600k.jpg', @ProcessorCategoryId, @IntelProcessorsId, @TechCompanyId, 1);

IF NOT EXISTS (SELECT 1 FROM Products WHERE Name = 'AMD Ryzen 7 5800X')
    INSERT INTO Products (Id, Name, Description, Price, DiscountPrice, Stock, ImageUrl, CategoryId, SubCategoryId, TechCompanyId, status)
    VALUES (NEWID(), 'AMD Ryzen 7 5800X', 'AMD Ryzen 7 processor with 8 cores and 16 threads', 349.99, 329.99, 40, 'amd-ryzen-7-5800x.jpg', @ProcessorCategoryId, @AMDProcessorsId, @TechCompanyId, 1);

IF NOT EXISTS (SELECT 1 FROM Products WHERE Name = 'ASUS ROG STRIX B660-F')
    INSERT INTO Products (Id, Name, Description, Price, DiscountPrice, Stock, ImageUrl, CategoryId, SubCategoryId, TechCompanyId, status)
    VALUES (NEWID(), 'ASUS ROG STRIX B660-F', 'ATX motherboard for 12th Gen Intel processors with WiFi 6E', 199.99, NULL, 30, 'asus-rog-strix-b660f.jpg', @MotherboardCategoryId, @ATXMotherboardsId, @TechCompanyId, 1);

IF NOT EXISTS (SELECT 1 FROM Products WHERE Name = 'MSI MPG B550 GAMING EDGE')
    INSERT INTO Products (Id, Name, Description, Price, DiscountPrice, Stock, ImageUrl, CategoryId, SubCategoryId, TechCompanyId, status)
    VALUES (NEWID(), 'MSI MPG B550 GAMING EDGE', 'ATX motherboard for AMD Ryzen processors with PCIe 4.0', 179.99, 159.99, 35, 'msi-mpg-b550-gaming-edge.jpg', @MotherboardCategoryId, @ATXMotherboardsId, @TechCompanyId, 1);

IF NOT EXISTS (SELECT 1 FROM Products WHERE Name = 'NVIDIA RTX 4070')
    INSERT INTO Products (Id, Name, Description, Price, DiscountPrice, Stock, ImageUrl, CategoryId, SubCategoryId, TechCompanyId, status)
    VALUES (NEWID(), 'NVIDIA RTX 4070', 'NVIDIA GeForce RTX 4070 graphics card with 12GB GDDR6X', 599.99, 579.99, 25, 'nvidia-rtx-4070.jpg', @GraphicsCardCategoryId, NULL, @TechCompanyId, 1);

IF NOT EXISTS (SELECT 1 FROM Products WHERE Name = 'AMD RX 6800 XT')
    INSERT INTO Products (Id, Name, Description, Price, DiscountPrice, Stock, ImageUrl, CategoryId, SubCategoryId, TechCompanyId, status)
    VALUES (NEWID(), 'AMD RX 6800 XT', 'AMD Radeon RX 6800 XT graphics card with 16GB GDDR6', 649.99, 629.99, 20, 'amd-rx-6800xt.jpg', @GraphicsCardCategoryId, NULL, @TechCompanyId, 1);

IF NOT EXISTS (SELECT 1 FROM Products WHERE Name = 'Corsair Vengeance LPX 32GB')
    INSERT INTO Products (Id, Name, Description, Price, DiscountPrice, Stock, ImageUrl, CategoryId, SubCategoryId, TechCompanyId, status)
    VALUES (NEWID(), 'Corsair Vengeance LPX 32GB', '32GB (2x16GB) DDR4-3200 CL16 memory kit', 129.99, 119.99, 60, 'corsair-vengeance-lpx-32gb.jpg', @RAMCategoryId, NULL, @TechCompanyId, 1);

IF NOT EXISTS (SELECT 1 FROM Products WHERE Name = 'Samsung 970 EVO Plus 1TB')
    INSERT INTO Products (Id, Name, Description, Price, DiscountPrice, Stock, ImageUrl, CategoryId, SubCategoryId, TechCompanyId, status)
    VALUES (NEWID(), 'Samsung 970 EVO Plus 1TB', '1TB NVMe M.2 SSD with up to 3,500 MB/s read speed', 99.99, 89.99, 80, 'samsung-970-evo-plus-1tb.jpg', @StorageCategoryId, NULL, @TechCompanyId, 1);

IF NOT EXISTS (SELECT 1 FROM Products WHERE Name = 'Corsair RM750x')
    INSERT INTO Products (Id, Name, Description, Price, DiscountPrice, Stock, ImageUrl, CategoryId, SubCategoryId, TechCompanyId, status)
    VALUES (NEWID(), 'Corsair RM750x', '750W 80+ Gold certified fully modular power supply', 129.99, 119.99, 45, 'corsair-rm750x.jpg', @PowerSupplyCategoryId, NULL, @TechCompanyId, 1);

IF NOT EXISTS (SELECT 1 FROM Products WHERE Name = 'LG 27GL850-B')
    INSERT INTO Products (Id, Name, Description, Price, DiscountPrice, Stock, ImageUrl, CategoryId, SubCategoryId, TechCompanyId, status)
    VALUES (NEWID(), 'LG 27GL850-B', '27" 1440p 144Hz Nano IPS gaming monitor with G-Sync', 449.99, 429.99, 30, 'lg-27gl850-b.jpg', @MonitorCategoryId, NULL, @TechCompanyId, 1);

IF NOT EXISTS (SELECT 1 FROM Products WHERE Name = 'NZXT H510')
    INSERT INTO Products (Id, Name, Description, Price, DiscountPrice, Stock, ImageUrl, CategoryId, SubCategoryId, TechCompanyId, status)
    VALUES (NEWID(), 'NZXT H510', 'ATX mid-tower case with tempered glass side panel', 79.99, 69.99, 55, 'nzxt-h510.jpg', @CaseCategoryId, NULL, @TechCompanyId, 1);

-- =============================================
-- 5. INSERT PRODUCT SPECIFICATIONS
-- =============================================

-- Get product IDs
DECLARE @IntelI7ProductId NVARCHAR(450) = (SELECT TOP 1 Id FROM Products WHERE Name = 'Intel Core i7-12700K');
DECLARE @IntelI5ProductId NVARCHAR(450) = (SELECT TOP 1 Id FROM Products WHERE Name = 'Intel Core i5-12600K');
DECLARE @AMD5800XProductId NVARCHAR(450) = (SELECT TOP 1 Id FROM Products WHERE Name = 'AMD Ryzen 7 5800X');
DECLARE @RTX4070ProductId NVARCHAR(450) = (SELECT TOP 1 Id FROM Products WHERE Name = 'NVIDIA RTX 4070');
DECLARE @RX6800XTProductId NVARCHAR(450) = (SELECT TOP 1 Id FROM Products WHERE Name = 'AMD RX 6800 XT');
DECLARE @CorsairRAMProductId NVARCHAR(450) = (SELECT TOP 1 Id FROM Products WHERE Name = 'Corsair Vengeance LPX 32GB');
DECLARE @SamsungSSDProductId NVARCHAR(450) = (SELECT TOP 1 Id FROM Products WHERE Name = 'Samsung 970 EVO Plus 1TB');

-- Intel i7-12700K Specifications
IF @IntelI7ProductId IS NOT NULL
BEGIN
    IF NOT EXISTS (SELECT 1 FROM Specifications WHERE ProductId = @IntelI7ProductId AND [Key] = 'Cores')
        INSERT INTO Specifications (Id, ProductId, [Key], Value) VALUES (NEWID(), @IntelI7ProductId, 'Cores', '12');
    IF NOT EXISTS (SELECT 1 FROM Specifications WHERE ProductId = @IntelI7ProductId AND [Key] = 'Threads')
        INSERT INTO Specifications (Id, ProductId, [Key], Value) VALUES (NEWID(), @IntelI7ProductId, 'Threads', '20');
    IF NOT EXISTS (SELECT 1 FROM Specifications WHERE ProductId = @IntelI7ProductId AND [Key] = 'Base Clock')
        INSERT INTO Specifications (Id, ProductId, [Key], Value) VALUES (NEWID(), @IntelI7ProductId, 'Base Clock', '3.6 GHz');
    IF NOT EXISTS (SELECT 1 FROM Specifications WHERE ProductId = @IntelI7ProductId AND [Key] = 'Max Turbo')
        INSERT INTO Specifications (Id, ProductId, [Key], Value) VALUES (NEWID(), @IntelI7ProductId, 'Max Turbo', '5.0 GHz');
    IF NOT EXISTS (SELECT 1 FROM Specifications WHERE ProductId = @IntelI7ProductId AND [Key] = 'Socket')
        INSERT INTO Specifications (Id, ProductId, [Key], Value) VALUES (NEWID(), @IntelI7ProductId, 'Socket', 'LGA 1700');
END

-- Intel i5-12600K Specifications
IF @IntelI5ProductId IS NOT NULL
BEGIN
    IF NOT EXISTS (SELECT 1 FROM Specifications WHERE ProductId = @IntelI5ProductId AND [Key] = 'Cores')
        INSERT INTO Specifications (Id, ProductId, [Key], Value) VALUES (NEWID(), @IntelI5ProductId, 'Cores', '10');
    IF NOT EXISTS (SELECT 1 FROM Specifications WHERE ProductId = @IntelI5ProductId AND [Key] = 'Threads')
        INSERT INTO Specifications (Id, ProductId, [Key], Value) VALUES (NEWID(), @IntelI5ProductId, 'Threads', '16');
    IF NOT EXISTS (SELECT 1 FROM Specifications WHERE ProductId = @IntelI5ProductId AND [Key] = 'Base Clock')
        INSERT INTO Specifications (Id, ProductId, [Key], Value) VALUES (NEWID(), @IntelI5ProductId, 'Base Clock', '3.7 GHz');
    IF NOT EXISTS (SELECT 1 FROM Specifications WHERE ProductId = @IntelI5ProductId AND [Key] = 'Max Turbo')
        INSERT INTO Specifications (Id, ProductId, [Key], Value) VALUES (NEWID(), @IntelI5ProductId, 'Max Turbo', '4.9 GHz');
END

-- AMD Ryzen 7 5800X Specifications
IF @AMD5800XProductId IS NOT NULL
BEGIN
    IF NOT EXISTS (SELECT 1 FROM Specifications WHERE ProductId = @AMD5800XProductId AND [Key] = 'Cores')
        INSERT INTO Specifications (Id, ProductId, [Key], Value) VALUES (NEWID(), @AMD5800XProductId, 'Cores', '8');
    IF NOT EXISTS (SELECT 1 FROM Specifications WHERE ProductId = @AMD5800XProductId AND [Key] = 'Threads')
        INSERT INTO Specifications (Id, ProductId, [Key], Value) VALUES (NEWID(), @AMD5800XProductId, 'Threads', '16');
    IF NOT EXISTS (SELECT 1 FROM Specifications WHERE ProductId = @AMD5800XProductId AND [Key] = 'Base Clock')
        INSERT INTO Specifications (Id, ProductId, [Key], Value) VALUES (NEWID(), @AMD5800XProductId, 'Base Clock', '3.8 GHz');
    IF NOT EXISTS (SELECT 1 FROM Specifications WHERE ProductId = @AMD5800XProductId AND [Key] = 'Max Boost')
        INSERT INTO Specifications (Id, ProductId, [Key], Value) VALUES (NEWID(), @AMD5800XProductId, 'Max Boost', '4.7 GHz');
    IF NOT EXISTS (SELECT 1 FROM Specifications WHERE ProductId = @AMD5800XProductId AND [Key] = 'Socket')
        INSERT INTO Specifications (Id, ProductId, [Key], Value) VALUES (NEWID(), @AMD5800XProductId, 'Socket', 'AM4');
END

-- RTX 4070 Specifications
IF @RTX4070ProductId IS NOT NULL
BEGIN
    IF NOT EXISTS (SELECT 1 FROM Specifications WHERE ProductId = @RTX4070ProductId AND [Key] = 'Memory')
        INSERT INTO Specifications (Id, ProductId, [Key], Value) VALUES (NEWID(), @RTX4070ProductId, 'Memory', '12 GB GDDR6X');
    IF NOT EXISTS (SELECT 1 FROM Specifications WHERE ProductId = @RTX4070ProductId AND [Key] = 'Memory Bus')
        INSERT INTO Specifications (Id, ProductId, [Key], Value) VALUES (NEWID(), @RTX4070ProductId, 'Memory Bus', '192-bit');
    IF NOT EXISTS (SELECT 1 FROM Specifications WHERE ProductId = @RTX4070ProductId AND [Key] = 'Boost Clock')
        INSERT INTO Specifications (Id, ProductId, [Key], Value) VALUES (NEWID(), @RTX4070ProductId, 'Boost Clock', '2.48 GHz');
    IF NOT EXISTS (SELECT 1 FROM Specifications WHERE ProductId = @RTX4070ProductId AND [Key] = 'Ray Tracing')
        INSERT INTO Specifications (Id, ProductId, [Key], Value) VALUES (NEWID(), @RTX4070ProductId, 'Ray Tracing', 'Yes');
END

-- RX 6800 XT Specifications
IF @RX6800XTProductId IS NOT NULL
BEGIN
    IF NOT EXISTS (SELECT 1 FROM Specifications WHERE ProductId = @RX6800XTProductId AND [Key] = 'Memory')
        INSERT INTO Specifications (Id, ProductId, [Key], Value) VALUES (NEWID(), @RX6800XTProductId, 'Memory', '16 GB GDDR6');
    IF NOT EXISTS (SELECT 1 FROM Specifications WHERE ProductId = @RX6800XTProductId AND [Key] = 'Memory Bus')
        INSERT INTO Specifications (Id, ProductId, [Key], Value) VALUES (NEWID(), @RX6800XTProductId, 'Memory Bus', '256-bit');
    IF NOT EXISTS (SELECT 1 FROM Specifications WHERE ProductId = @RX6800XTProductId AND [Key] = 'Boost Clock')
        INSERT INTO Specifications (Id, ProductId, [Key], Value) VALUES (NEWID(), @RX6800XTProductId, 'Boost Clock', '2.25 GHz');
    IF NOT EXISTS (SELECT 1 FROM Specifications WHERE ProductId = @RX6800XTProductId AND [Key] = 'Ray Tracing')
        INSERT INTO Specifications (Id, ProductId, [Key], Value) VALUES (NEWID(), @RX6800XTProductId, 'Ray Tracing', 'Yes');
END

-- =============================================
-- 6. INSERT PRODUCT WARRANTIES
-- =============================================

-- Intel i7-12700K Warranty
IF @IntelI7ProductId IS NOT NULL AND NOT EXISTS (SELECT 1 FROM Warranties WHERE ProductId = @IntelI7ProductId)
    INSERT INTO Warranties (Id, ProductId, Description, StartDate, EndDate)
    VALUES (NEWID(), @IntelI7ProductId, '3-year manufacturer warranty', GETDATE(), DATEADD(year, 3, GETDATE()));

-- RTX 4070 Warranty
IF @RTX4070ProductId IS NOT NULL AND NOT EXISTS (SELECT 1 FROM Warranties WHERE ProductId = @RTX4070ProductId)
    INSERT INTO Warranties (Id, ProductId, Description, StartDate, EndDate)
    VALUES (NEWID(), @RTX4070ProductId, '3-year manufacturer warranty', GETDATE(), DATEADD(year, 3, GETDATE()));

-- Samsung SSD Warranty
IF @SamsungSSDProductId IS NOT NULL AND NOT EXISTS (SELECT 1 FROM Warranties WHERE ProductId = @SamsungSSDProductId)
    INSERT INTO Warranties (Id, ProductId, Description, StartDate, EndDate)
    VALUES (NEWID(), @SamsungSSDProductId, '5-year manufacturer warranty', GETDATE(), DATEADD(year, 5, GETDATE()));

-- =============================================
-- 7. SUMMARY REPORT
-- =============================================

DECLARE @CategoryCount INT = (SELECT COUNT(*) FROM Categories);
DECLARE @SubCategoryCount INT = (SELECT COUNT(*) FROM SubCategories);
DECLARE @ProductCount INT = (SELECT COUNT(*) FROM Products);
DECLARE @SpecificationCount INT = (SELECT COUNT(*) FROM Specifications);
DECLARE @WarrantyCount INT = (SELECT COUNT(*) FROM Warranties);

PRINT '=== PRODUCT DATA INSERTION COMPLETED ===';
PRINT 'Categories inserted/verified: ' + CAST(@CategoryCount AS VARCHAR(10));
PRINT 'Sub-Categories inserted/verified: ' + CAST(@SubCategoryCount AS VARCHAR(10));
PRINT 'Products inserted: ' + CAST(@ProductCount AS VARCHAR(10));
PRINT 'Specifications inserted: ' + CAST(@SpecificationCount AS VARCHAR(10));
PRINT 'Warranties inserted: ' + CAST(@WarrantyCount AS VARCHAR(10));

PRINT '';
PRINT '=== SAMPLE PRODUCTS AVAILABLE ===';
SELECT Name, Price, Stock, CategoryId FROM Products ORDER BY Name;

PRINT '';
PRINT 'Script completed successfully!'; 