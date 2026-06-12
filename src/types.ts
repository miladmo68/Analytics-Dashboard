/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type ActiveTab = 'overview' | 'analytics' | 'customers' | 'strategy' | 'settings';

export interface ChartDataPoint {
  name: string;
  revenue: number;
  customers: number;
  subscriptions: number;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  tier: 'Enterprise' | 'Professional' | 'Developer' | 'Basic';
  spend: number;
  status: 'Active' | 'Pending' | 'Suspended';
  dateJoined: string;
}

export interface ProductPerformance {
  name: string;
  sales: number;
  revenue: number;
  growth: number;
  percentage: number; // For visualization
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
}
