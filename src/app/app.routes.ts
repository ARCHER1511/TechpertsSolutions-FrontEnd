import { Routes } from '@angular/router';
import { authGuard } from './Guards/auth.guard';
import { adminGuard, techCompanyGuard, customerGuard, deliveryPersonGuard } from './Guards/role.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },

  { path: 'home', loadComponent: () => import('./components/home/home.component').then(m => m.HomeComponent), title: 'Home Page' },

  { path: 'about', loadComponent: () => import('./components/about/about.component').then(m => m.AboutComponent), title: 'About Page' },
  { path: 'blog/:slug', loadComponent: () => import('./components/categories/article-detail/article-detail.component').then(m => m.ArticleDetailComponent), title: 'Article Details' },
  { path: 'blog', loadComponent: () => import('./components/blog/blog.component').then(m => m.BlogComponent), title: 'Blog Page' },
  { path: 'contact', loadComponent: () => import('./components/contact/contact.component').then(m => m.ContactComponent), title: 'Contact Page' },
  { path: 'privacy', loadComponent: () => import('./components/privacy/privacy.component').then(m => m.PrivacyComponent), title: 'Privacy Page' },
  { path: 'terms', loadComponent: () => import('./components/terms/terms.component').then(m => m.TermsComponent), title: 'Terms Page' },
  
  // New footer pages
  { path: 'watch-demo', loadComponent: () => import('./components/watch-demo/watch-demo.component').then(m => m.WatchDemoComponent), title: 'Watch Demo' },
  { path: 'leadership', loadComponent: () => import('./components/leadership/leadership.component').then(m => m.LeadershipComponent), title: 'Leadership' },
  { path: 'careers', loadComponent: () => import('./components/careers/careers.component').then(m => m.CareersComponent), title: 'Careers' },
  { path: 'investor-relations', loadComponent: () => import('./components/investor-relations/investor-relations.component').then(m => m.InvestorRelationsComponent), title: 'Investor Relations' },
  { path: 'media-kit', loadComponent: () => import('./components/media-kit/media-kit.component').then(m => m.MediaKitComponent), title: 'Media Kit' },
  { path: 'community', loadComponent: () => import('./components/community/community.component').then(m => m.CommunityComponent), title: 'Community' },
  { path: 'events', loadComponent: () => import('./components/events/events.component').then(m => m.EventsComponent), title: 'Events' },
  { path: 'help-center', loadComponent: () => import('./components/help-center/help-center.component').then(m => m.HelpCenterComponent), title: 'Help Center' },
  { path: 'partners', loadComponent: () => import('./components/partners/partners.component').then(m => m.PartnersComponent), title: 'Partners' },
 
  { path: 'products', loadComponent: () => import('./components/products/products.component').then(m => m.ProductsComponent), title: 'Products Page' },
  { path: 'product-details/:id', loadComponent: () => import('./components/products/components/productdetails/productdetails.component').then(m => m.ProductdetailsComponent), title: 'Product Details' },
  { path: 'login', loadComponent: () => import('./components/log-in/log-in.component').then(m => m.LogInComponent), title: 'LogIn Page' },
  { path: 'register', loadComponent: () => import('./components/register/register.component').then(m => m.RegisterComponent), title: 'Register Page' },
  { path: 'cart', loadComponent: () => import('./components/cart/cart.component').then(m => m.CartComponent), title: 'Cart', canActivate: [authGuard] },

  { path: 'selector', loadComponent: () => import('./components/pc-build/selector/selector.component').then(m => m.SelectorComponent), title: 'Component Selector' },
  { path: 'categories', loadComponent: () => import('./components/categories/categories.component').then(m => m.CategoriesComponent), title: 'Product Categories' },
  { path: 'category-details/:id', loadComponent: () => import('./components/categories/category-details/category-details.component').then(m => m.CategoryDetailsComponent), title: 'Category Products' },
  { path: 'order', loadComponent: () => import('./components/order/order.component').then(m => m.OrderComponent), title: 'Order', canActivate: [authGuard] },
  { path: 'wish-list', loadComponent: () => import('./components/wishlist/wishlist.component').then(m => m.WishlistComponent), title: 'Wish List', canActivate: [authGuard] },

  { path: 'pc-compare', loadComponent: () => import('./components/pc-compare/pc-compare.component').then(m => m.PcCompareComponent), title: 'Pc Compare' },
  { path: 'test-comparison', loadComponent: () => import('./components/pc-compare/test-comparison.component').then(m => m.TestComparisonComponent), title: 'Test Comparison' },
  { path: 'debug-specifications', loadComponent: () => import('./components/pc-compare/debug-specifications.component').then(m => m.DebugSpecificationsComponent), title: 'Debug Specifications' },

  // Profile Route
  { path: 'profile', loadComponent: () => import('./components/profile/profile.component').then(m => m.ProfileComponent), title: 'Profile', canActivate: [authGuard] },

  // Admin Dashboard Routes
  {
    path: 'dashboard',
    loadComponent: () => import('./components/dashboard/dashboard.component').then(m => m.DashboardComponent),
    title: 'Admin Dashboard',
    canActivate: [authGuard, adminGuard],
    children: [
      {
        path: 'customers',
        loadComponent: () => import('./components/dashboard/components/customers/customers.component').then(m => m.CustomersComponent),
        title: 'Dashboard Customers'
      },
      {
        path: 'new-customer',
        loadComponent: () => import('./components/dashboard/components/add-new-customer/add-new-customer.component').then(m => m.AddNewCustomerComponent),
        title: 'Dashboard New Customer'
      },
      {
        path: 'edit-customer',
        loadComponent: () => import('./components/dashboard/components/edit-customer/edit-customer.component').then(m => m.EditCustomerComponent),
        title: 'Edit Customer'
      },
      {
        path: 'pending-products',
        loadComponent: () => import('./components/dashboard/components/pending-products/pending-products.component').then(m => m.PendingProductsComponent),
        title: 'Pending Products'
      },
      {
        path: 'create-product',
        loadComponent: () => import('./components/dashboard/components/create-product/create-product.component').then(m => m.CreateProductComponent),
        title: 'Create Product'
      },
      {
        path: 'role-management',
        loadComponent: () => import('./components/dashboard/components/role-management/role-management.component').then(m => m.RoleManagementComponent),
        title: 'Role Management'
      }
    ]
  },

  // Tech Company Routes
  {
    path: 'tech-company',
    canActivate: [authGuard, techCompanyGuard],
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./components/tech-company-dashboard/tech-company-dashboard.component').then(m => m.TechCompanyDashboardComponent),
        title: 'Tech Company Dashboard'
      },
      {
        path: 'maintenance',
        loadComponent: () => import('./components/maintenance/maintenance.component').then(m => m.MaintenanceComponent),
        title: 'Maintenance Requests'
      },
      {
        path: 'products',
        loadComponent: () => import('./components/tech-company-products/tech-company-products.component').then(m => m.TechCompanyProductsComponent),
        title: 'My Products'
      }
    ]
  },

  // Delivery Person Routes
  {
    path: 'delivery',
    canActivate: [authGuard, deliveryPersonGuard],
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./components/delivery-dashboard/delivery-dashboard.component').then(m => m.DeliveryDashboardComponent),
        title: 'Delivery Dashboard'
      },
      {
        path: 'orders',
        loadComponent: () => import('./components/delivery-orders/delivery-orders.component').then(m => m.DeliveryOrdersComponent),
        title: 'My Deliveries'
      },
      {
        path: 'history',
        loadComponent: () => import('./components/delivery-history/delivery-history.component').then(m => m.DeliveryHistoryComponent),
        title: 'Delivery History'
      }
    ]
  },

  // Customer Routes
  {
    path: 'customer',
    canActivate: [authGuard, customerGuard],
    children: [
      {
        path: 'orders',
        loadComponent: () => import('./components/customer-orders/customer-orders.component').then(m => m.CustomerOrdersComponent),
        title: 'My Orders'
      },
      {
        path: 'maintenance',
        loadComponent: () => import('./components/customer-maintenance/customer-maintenance.component').then(m => m.CustomerMaintenanceComponent),
        title: 'Maintenance Requests'
      }
    ]
  },

  // Maintenance Routes
  {
    path: 'maintenance',
    canActivate: [authGuard],
    children: [
      {
        path: 'create',
        loadComponent: () => import('./components/maintenance-create/maintenance-create.component').then(m => m.MaintenanceCreateComponent),
        title: 'Create Maintenance Request'
      },
      {
        path: 'history',
        loadComponent: () => import('./components/maintenance-history/maintenance-history.component').then(m => m.MaintenanceHistoryComponent),
        title: 'Maintenance History'
      }
    ]
  },

  // Error Routes
  { path: 'unauthorized', loadComponent: () => import('./components/unauthorized/unauthorized.component').then(m => m.UnauthorizedComponent), title: 'Unauthorized' },
  { path: '**', redirectTo: 'home' }
];