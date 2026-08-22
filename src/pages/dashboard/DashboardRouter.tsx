import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { ConsumerDashboard } from './ConsumerDashboard';
import { RetailDashboard } from './RetailDashboard';
import { WarehouseDashboard } from './WarehouseDashboard';
import { InspectorDashboard } from './InspectorDashboard';
import { AdminDashboard } from './AdminDashboard';

export const DashboardRouter: React.FC = () => {
  const { user } = useAuth();

  switch (user?.role) {
    case 'Retail Manager':
      return <RetailDashboard />;
    case 'Warehouse Operator':
      return <WarehouseDashboard />;
    case 'Food Quality Inspector':
      return <InspectorDashboard />;
    case 'Administrator':
      return <AdminDashboard />;
    case 'Consumer':
    default:
      return <ConsumerDashboard />;
  }
};
