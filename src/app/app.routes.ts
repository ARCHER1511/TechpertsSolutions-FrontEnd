import { Routes } from '@angular/router';
import { authGuard } from './Guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },

  { path: 'home', loadComponent: () => import('./components/home/home.component').then(m => m.HomeComponent), title: 'Home Page' },
  { path: 'blog', loadComponent: () => import('./components/blog/blog.component').then(m => m.BlogComponent), title: 'Blog Page' },

 
  { path: 'blog/:slug', loadComponent: () => import('./components/categories/article-detail/article-detail.component').then(m => m.ArticleDetailComponent), title: 'Article Details' },

  { path: 'about', loadComponent: () => import('./components/about/about.component').then(m => m.AboutComponent), title: 'About Page' },
  { path: 'products', loadComponent: () => import('./components/products/products.component').then(m => m.ProductsComponent), title: 'Products Page' },
  { path: 'product-details/:id', loadComponent: () => import('./components/products/components/productdetails/productdetails.component').then(m => m.ProductdetailsComponent), title: 'Product Details' },
  { path: 'contact', loadComponent: () => import('./components/contact/contact.component').then(m => m.ContactComponent), title: 'Contact Page' },
  { path: 'about', loadComponent: () => import('./components/about/about.component').then(m => m.AboutComponent), title: 'About Page' },
  { path: 'contact', loadComponent: () => import('./components/contact/contact.component').then(m => m.ContactComponent), title: 'Contact Page' },
  { path: 'privacy', loadComponent: () => import('./components/privacy/privacy.component').then(m => m.PrivacyComponent), title: 'Privacy Page' },
  { path: 'terms', loadComponent: () => import('./components/terms/terms.component').then(m => m.TermsComponent), title: 'Terms Page' },
 
  { path: 'blog/:slug', loadComponent: () => import('./components/categories/article-detail/article-detail.component').then(m => m.ArticleDetailComponent), title: 'Article Details' },

  { path: 'products', loadComponent: () => import('./components/products/products.component').then(m => m.ProductsComponent), title: 'Products Page' },
  { path: 'product-details/:id', loadComponent: () => import('./components/products/components/productdetails/productdetails.component').then(m => m.ProductdetailsComponent), title: 'Product Details' },
  { path: 'login', loadComponent: () => import('./components/log-in/log-in.component').then(m => m.LogInComponent), title: 'LogIn Page' },
  { path: 'register', loadComponent: () => import('./components/register/register.component').then(m => m.RegisterComponent), title: 'Register Page' },
  { path: 'cart', loadComponent: () => import('./components/cart/cart.component').then(m => m.CartComponent), title: 'Cart', canActivate: [authGuard] },

  { path: 'selector', loadComponent: () => import('./components/pc-build/selector/selector.component').then(m => m.SelectorComponent), title: 'Component Selector' },
  { path: 'categories', loadComponent: () => import('./components/categories/categories.component').then(m => m.CategoriesComponent), title: 'Product Categories' },
  { path: 'category-details/:id', loadComponent: () => import('./components/categories/category-details/category-details.component').then(m => m.CategoryDetailsComponent), title: 'Category Products' },
  { path: 'order', loadComponent: () => import('./components/order/order.component').then(m => m.OrderComponent), title: 'Order' },
  { path: 'wish-list', loadComponent: () => import('./components/wishlist/wishlist.component').then(m => m.WishlistComponent), title: 'Wish List' },

  { path: 'pc-compare', loadComponent: () => import('./components/pc-compare/pc-compare.component').then(m => m.PcCompareComponent), title: 'Pc Compare' },
  { path: 'test-comparison', loadComponent: () => import('./components/pc-compare/test-comparison.component').then(m => m.TestComparisonComponent), title: 'Test Comparison' },
  { path: 'debug-specifications', loadComponent: () => import('./components/pc-compare/debug-specifications.component').then(m => m.DebugSpecificationsComponent), title: 'Debug Specifications' },

  {
    path: 'dashboard',
    loadComponent: () => import('./components/dashboard/dashboard.component').then(m => m.DashboardComponent),
    title: 'Admin Dashboard',
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
      }
    ]
  }
];