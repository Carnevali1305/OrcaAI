export interface Project {
  id: string;
  name: string;
  client: string;
  address: string;
  status: 'planning' | 'active' | 'completed';
  totalBudget: number;
  startDate: string;
  completionPercentage: number;
}

export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
}

export interface BudgetItem {
  id: string;
  code: string;
  description: string;
  unit: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  category: string;
  source: 'SINAPI' | 'TCPO' | 'OWN' | 'AI';
}

export interface Budget {
  id: string;
  projectId: string;
  version: number;
  items: BudgetItem[];
  bdi: number;
  totalWithBdi: number;
  createdAt: string;
  status: 'draft' | 'approved' | 'obsolete';
}

export interface RealizedCost {
  id: string;
  projectId: string;
  description: string;
  amount: number;
  date: string;
  category: string;
}

export interface ReferenceTable {
  id: string;
  name: string;
  type: 'SINAPI' | 'TCPO' | 'OWN';
  region: string;
  date: string;
}

export enum PlanTier {
  BASIC = 'Básico',
  INTERMEDIATE = 'Intermediário',
  ADVANCED = 'Avançado'
}

export interface User {
  id: string;
  name: string;
  email: string;
  company: string;
  plan: PlanTier;
  avatarUrl: string;
}

export type ViewState = 'landing' | 'auth' | 'dashboard' | 'projects' | 'clients' | 'budget-editor' | 'ai-consultant' | 'realized' | 'tables' | 'reports' | 'settings';
