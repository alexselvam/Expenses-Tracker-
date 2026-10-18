import { Routes } from '@angular/router';
import { Layout } from './component/layout/layout';

export const routes: Routes = [
    // {
    //     path: '',
    //     component: Layout,
    //     children: [
    {
        path: '',
        loadComponent: () => import('./component/home/home').then(m => m.Home),
    },
    {
        path: 'login',
        loadComponent: () => import('./component/login/login').then(m => m.Login),
    },
    {
        path: 'register',
        loadComponent: () => import('./component/register/register').then(m => m.Register),
    },
    {
        path: 'forgetpass',
        loadComponent: () => import('./component/forgotpassword/forgotpassword').then(m => m.Forgotpassword),
    },
    {
        path: 'resetpass',
        loadComponent: () => import('./component/reset-password/reset-password').then(m => m.ResetPassword),
    },
    {
        path: 'dashboard',
        loadComponent: () => import('./component/dashboard/dashboard').then(m => m.Dashboard),
    },
    {
        path: 'transaction',
        loadComponent: () => import('./component/transaction/transaction').then(m => m.Transaction),
    },
    {
        path: 'income',
        loadComponent: () => import('./component/income/income').then(m => m.Income),
    },
    {
        path: 'expenses',
        loadComponent: () => import('./component/expense/expense').then(m => m.Expense),
    },
    {
        path: 'reports',
        loadComponent: () => import('./component/report/report').then(m => m.Report),
    },
    {
        path: 'settings',
        loadComponent: () => import('./component/settings/settings').then(m => m.Settings),
    },
    {
        path: 'features',
        loadComponent: () => import('./component/features/features').then(m => m.Features),
    },
    {
        path: 'about',
        loadComponent: () => import('./component/about/about').then(m => m.About),
    },
     {
        path: 'sales_report',
        loadComponent: () => import('./component/sales-dashboard/sales-dashboard/sales-dashboard').then(m => m.SalesDashboard),
    },
    // ]
    // }
];

