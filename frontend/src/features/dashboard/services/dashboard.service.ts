import { api } from '@/lib/api/client';
import { API_ROUTES } from '@/lib/constants';
import { type DashboardData } from '../types/dashboard.types';

export const dashboardService = {
  getDashboardData: async (): Promise<DashboardData> => {
    const results = await Promise.allSettled([
      api.get<any[]>(API_ROUTES.PROPERTIES.BASE),
      api.get<any[]>(API_ROUTES.UNITS.BASE),
      api.get<any[]>(API_ROUTES.TENANTS.BASE),
      api.get<any[]>(API_ROUTES.BILLING.INVOICES),
      api.get<any[]>(API_ROUTES.PAYMENTS.BASE),
      api.get<any[]>(API_ROUTES.MAINTENANCE.BASE),
    ]);

    const propertyList = results[0].status === 'fulfilled' ? (results[0].value || []) : [];
    const unitList = results[1].status === 'fulfilled' ? (results[1].value || []) : [];
    const tenantList = results[2].status === 'fulfilled' ? (results[2].value || []) : [];
    const invoiceList = results[3].status === 'fulfilled' ? (results[3].value || []) : [];
    const paymentList = results[4].status === 'fulfilled' ? (results[4].value || []) : [];
    const maintenanceList = results[5].status === 'fulfilled' ? (results[5].value || []) : [];

    // Calculate stats
    const totalProperties = propertyList.length;
    const totalUnits = unitList.length;
    const occupiedUnits = unitList.filter((u: any) => u.status === 'OCCUPIED').length;
    const vacantUnits = unitList.filter((u: any) => u.status === 'VACANT').length;
    const maintenanceUnits = unitList.filter((u: any) => u.status === 'MAINTENANCE').length;
    const totalTenants = tenantList.length;

    // Financial stats
    const pendingInvoices = invoiceList.filter((i: any) => 
      i.status === 'PENDING' || i.status === 'PARTIALLY_PAID'
    );
    const totalRentExpected = pendingInvoices.reduce((sum: number, inv: any) => sum + Number(inv.totalAmount), 0);
    const totalRentCollected = paymentList
      .filter((p: any) => p.status === 'COMPLETED')
      .reduce((sum: number, p: any) => sum + Number(p.amount), 0);

    const collectionRate = totalRentExpected > 0 
      ? (totalRentCollected / totalRentExpected) * 100 
      : 0;

    const occupancyRate = totalUnits > 0 
      ? (occupiedUnits / totalUnits) * 100 
      : 0;

    const openMaintenanceTickets = maintenanceList.filter(
      (t: any) => t.status !== 'CLOSED' && t.status !== 'COMPLETED'
    ).length;

    const overdueInvoices = invoiceList.filter(
      (i: any) => i.status === 'OVERDUE'
    ).length;

    // Generate revenue data (last 6 months)
    const revenueData = [];
    for (let i = 5; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const month = date.toLocaleDateString('en-KE', { month: 'short', year: 'numeric' });
      
      // Filter invoices for this month
      const monthInvoices = invoiceList.filter((inv: any) => {
        const invDate = new Date(inv.createdAt);
        return invDate.getMonth() === date.getMonth() && 
               invDate.getFullYear() === date.getFullYear();
      });
      
      const expected = monthInvoices.reduce((sum: number, inv: any) => sum + Number(inv.totalAmount), 0);
      
      // Filter payments for this month
      const monthPayments = paymentList.filter((p: any) => {
        const pDate = new Date(p.paymentDate);
        return pDate.getMonth() === date.getMonth() && 
               pDate.getFullYear() === date.getFullYear() &&
               p.status === 'COMPLETED';
      });
      
      const collected = monthPayments.reduce((sum: number, p: any) => sum + Number(p.amount), 0);
      
      revenueData.push({ month, expected, collected });
    }

    // Generate occupancy data (last 6 months)
    const occupancyData = [];
    for (let i = 5; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const month = date.toLocaleDateString('en-KE', { month: 'short', year: 'numeric' });
      
      // Simulate occupancy data (in real app, this would come from lease data)
      const total = totalUnits || 10;
      const occupied = Math.round(total * (0.5 + Math.random() * 0.4));
      
      occupancyData.push({
        month,
        occupied,
        vacant: total - occupied,
      });
    }

    // Generate recent activity
    const recentActivity: any[] = [];
    
    // Add recent payments
    paymentList.slice(0, 3).forEach((payment: any) => {
      recentActivity.push({
        id: `payment-${payment.id}`,
        type: 'payment',
        description: `Payment of ${payment.amount} received`,
        amount: Number(payment.amount),
        status: payment.status,
        createdAt: payment.paymentDate,
        user: payment.tenant,
      });
    });

    // Add recent invoices
    invoiceList.slice(0, 2).forEach((invoice: any) => {
      recentActivity.push({
        id: `invoice-${invoice.id}`,
        type: 'invoice',
        description: `Invoice ${invoice.invoiceNumber} generated`,
        amount: Number(invoice.totalAmount),
        status: invoice.status,
        createdAt: invoice.createdAt,
        user: invoice.tenant,
      });
    });

    // Add recent maintenance
    maintenanceList.slice(0, 2).forEach((ticket: any) => {
      recentActivity.push({
        id: `maintenance-${ticket.id}`,
        type: 'maintenance',
        description: `Maintenance ticket: ${ticket.title}`,
        status: ticket.status,
        createdAt: ticket.createdAt,
      });
    });

    // Sort by date and take latest 5
    recentActivity.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    const recentActivityLimited = recentActivity.slice(0, 5);

    // Generate upcoming payments
    const upcomingPayments = pendingInvoices.slice(0, 5).map((invoice: any) => ({
      id: invoice.id,
      tenantName: invoice.tenant ? `${invoice.tenant.firstName} ${invoice.tenant.lastName}` : 'Unknown',
      unitNumber: invoice.lease?.unit?.number || 'N/A',
      propertyName: invoice.lease?.unit?.property?.name || 'N/A',
      amount: Number(invoice.balance) || Number(invoice.totalAmount),
      dueDate: invoice.dueDate,
      status: (invoice.status === 'OVERDUE' ? 'overdue' : 'pending') as 'pending' | 'overdue',
    }));

    // Generate maintenance alerts
    const maintenanceAlerts = maintenanceList
      .filter((t: any) => t.status !== 'CLOSED' && t.status !== 'COMPLETED')
      .slice(0, 5)
      .map((ticket: any) => ({
        id: ticket.id,
        title: ticket.title,
        priority: ticket.priority,
        status: ticket.status,
        unitNumber: ticket.unit?.number || 'N/A',
        propertyName: ticket.unit?.property?.name || 'N/A',
        createdAt: ticket.createdAt,
      }));

    return {
      stats: {
        totalProperties,
        totalUnits,
        occupiedUnits,
        vacantUnits,
        maintenanceUnits,
        totalRentCollected,
        totalRentExpected,
        collectionRate,
        occupancyRate,
        totalTenants,
        openMaintenanceTickets,
        overdueInvoices,
      },
      revenueData,
      occupancyData,
      recentActivity: recentActivityLimited,
      upcomingPayments,
      maintenanceAlerts,
    };
  },
};