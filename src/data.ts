/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ChartDataPoint, Customer, ProductPerformance } from './types';

export const initialChartData: ChartDataPoint[] = [
  { name: 'Jan', revenue: 14800, customers: 10200, subscriptions: 1100 },
  { name: 'Feb', revenue: 19200, customers: 10600, subscriptions: 1240 },
  { name: 'Mar', revenue: 23100, customers: 11150, subscriptions: 1390 },
  { name: 'Apr', revenue: 28400, customers: 11700, subscriptions: 1510 },
  { name: 'May', revenue: 31200, customers: 12100, subscriptions: 1680 },
  { name: 'Jun', revenue: 32232, customers: 12480, subscriptions: 1820 }
];

export const initialProductsPerformance: ProductPerformance[] = [
  { name: 'Advanced Enterprise Hub', sales: 98, revenue: 74200, growth: 18.4, percentage: 50 },
  { name: 'Professional Suite', sales: 247, revenue: 44600, growth: 12.1, percentage: 30 },
  { name: 'Developer Core API', sales: 412, revenue: 22132, growth: 8.4, percentage: 15 },
  { name: 'Starter Sandbox Plan', sales: 812, revenue: 8000, growth: -2.3, percentage: 5 }
];

export const initialCustomers: Customer[] = [
  {
    id: 'CUST-381',
    name: 'Sarah Jenkins',
    email: 'sarah.j@vertexindustries.com',
    tier: 'Enterprise',
    spend: 24500,
    status: 'Active',
    dateJoined: '2025-11-12'
  },
  {
    id: 'CUST-104',
    name: 'Mateo Russo',
    email: 'm.russo@auroraflow.io',
    tier: 'Professional',
    spend: 12800,
    status: 'Active',
    dateJoined: '2026-01-20'
  },
  {
    id: 'CUST-839',
    name: 'Yuki Takahashi',
    email: 'takahashi.yuki@tokyodatatech.jp',
    tier: 'Enterprise',
    spend: 48900,
    status: 'Active',
    dateJoined: '2025-08-04'
  },
  {
    id: 'CUST-611',
    name: 'Nils Bergqvist',
    email: 'nbergqvist@nordicstack.se',
    tier: 'Developer',
    spend: 6400,
    status: 'Pending',
    dateJoined: '2026-05-19'
  },
  {
    id: 'CUST-293',
    name: 'Elena Rostova',
    email: 'elena.ros@novatech.co.uk',
    tier: 'Basic',
    spend: 1800,
    status: 'Suspended',
    dateJoined: '2025-06-14'
  },
  {
    id: 'CUST-445',
    name: 'David Okafor',
    email: 'd.okafor@prime-solutions.ng',
    tier: 'Professional',
    spend: 14200,
    status: 'Active',
    dateJoined: '2026-03-02'
  },
  {
    id: 'CUST-902',
    name: 'Clara Dupont',
    email: 'clara.dupont@hexacycle.fr',
    tier: 'Basic',
    spend: 932,
    status: 'Pending',
    dateJoined: '2026-05-28'
  }
];
