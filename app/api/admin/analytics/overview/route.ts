import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { connectDB } from '@/lib/mongodb';
import Developer from '@/lib/models/Developer';
import Client from '@/lib/models/Client';
import ProjectModel from '@/lib/models/ProjectModel';
import Quotation from '@/lib/models/Quotation';
import Invoice from '@/lib/models/Invoice';

// GET - Fetch analytics overview
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession();
    
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectDB();

    // Get counts
    const [
      totalDevelopers,
      activeDevelopers,
      totalClients,
      activeClients,
      totalProjects,
      activeProjects,
      totalQuotations,
      approvedQuotations,
      totalInvoices,
      paidInvoices
    ] = await Promise.all([
      Developer.countDocuments(),
      Developer.countDocuments({ status: 'active' }),
      Client.countDocuments(),
      Client.countDocuments({ status: 'active' }),
      ProjectModel.countDocuments(),
      ProjectModel.countDocuments({ status: 'in-progress' }),
      Quotation.countDocuments(),
      Quotation.countDocuments({ status: 'approved' }),
      Invoice.countDocuments(),
      Invoice.countDocuments({ status: 'paid' }),
    ]);

    // Get financial data
    const invoices = await Invoice.find();
    const clients = await Client.find();
    const projects = await ProjectModel.find();

    const totalRevenue = invoices.reduce((sum, inv) => sum + inv.amountPaid, 0);
    const outstandingAmount = invoices.reduce((sum, inv) => sum + inv.amountDue, 0);
    const totalProjectBudget = projects.reduce((sum, proj) => sum + proj.budget.estimated, 0);

    // Get recent items
    const [recentProjects, recentInvoices, recentQuotations] = await Promise.all([
      ProjectModel.find().sort({ createdAt: -1 }).limit(5).populate('client', 'name company'),
      Invoice.find().sort({ createdAt: -1 }).limit(5).populate('client', 'name company'),
      Quotation.find().sort({ createdAt: -1 }).limit(5).populate('client', 'name company'),
    ]);

    // Calculate monthly revenue (last 6 months)
    const monthlyRevenue = [];
    const now = new Date();
    for (let i = 5; i >= 0; i--) {
      const monthStart = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 0, 23, 59, 59);
      
      const monthInvoices = invoices.filter(inv => {
        const paidDate = inv.paidAt || inv.createdAt;
        return paidDate >= monthStart && paidDate <= monthEnd;
      });
      
      const revenue = monthInvoices.reduce((sum, inv) => sum + inv.amountPaid, 0);
      
      monthlyRevenue.push({
        month: monthStart.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
        revenue,
      });
    }

    // Project status breakdown
    const projectsByStatus = await ProjectModel.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    // Top clients by revenue
    const topClients = clients
      .sort((a, b) => b.totalRevenue - a.totalRevenue)
      .slice(0, 5)
      .map(client => ({
        name: client.name,
        company: client.company,
        revenue: client.totalRevenue,
        projects: client.totalProjects,
      }));

    // Developer performance
    const developers = await Developer.find().sort({ totalProjectsCompleted: -1 }).limit(5);
    const topDevelopers = developers.map(dev => ({
      name: dev.name,
      role: dev.role,
      projects: dev.totalProjectsCompleted,
      rating: dev.averageRating,
      earnings: dev.totalEarnings,
    }));

    return NextResponse.json({
      success: true,
      data: {
        overview: {
          developers: {
            total: totalDevelopers,
            active: activeDevelopers,
          },
          clients: {
            total: totalClients,
            active: activeClients,
          },
          projects: {
            total: totalProjects,
            active: activeProjects,
          },
          quotations: {
            total: totalQuotations,
            approved: approvedQuotations,
          },
          invoices: {
            total: totalInvoices,
            paid: paidInvoices,
          },
          financial: {
            totalRevenue,
            outstandingAmount,
            totalProjectBudget,
          },
        },
        monthlyRevenue,
        projectsByStatus,
        topClients,
        topDevelopers,
        recent: {
          projects: recentProjects,
          invoices: recentInvoices,
          quotations: recentQuotations,
        },
      },
    });
  } catch (error: any) {
    console.error('Error fetching analytics:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
