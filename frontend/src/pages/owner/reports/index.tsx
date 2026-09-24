import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  FileText, 
  Building2, 
  Home, 
  Wrench, 
  TrendingUp,
  ArrowRight 
} from 'lucide-react';

const reports = [
  {
    title: 'Income Statement',
    description: 'Revenue summary and collection rates',
    icon: TrendingUp,
    path: '/reports/income-statement',
    color: 'bg-emerald-500/10 text-emerald-500',
  },
  {
    title: 'Rent Roll',
    description: 'Current rental income by unit',
    icon: Building2,
    path: '/reports/rent-roll',
    color: 'bg-blue-500/10 text-blue-500',
  },
  {
    title: 'Arrears Aging',
    description: 'Outstanding balances by age',
    icon: FileText,
    path: '/reports/arrears-aging',
    color: 'bg-red-500/10 text-red-500',
  },
  {
    title: 'Occupancy Report',
    description: 'Property occupancy rates',
    icon: Home,
    path: '/reports/occupancy',
    color: 'bg-purple-500/10 text-purple-500',
  },
  {
    title: 'Maintenance Report',
    description: 'Maintenance ticket summary',
    icon: Wrench,
    path: '/reports/maintenance',
    color: 'bg-amber-500/10 text-amber-500',
  },
];

export default function ReportsIndexPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-neutral-900 dark:text-white">Reports</h1>
        <p className="mt-1 text-neutral-500 dark:text-neutral-400">
          Generate and view reports for your property portfolio
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {reports.map((report) => {
          const Icon = report.icon;
          return (
            <Link key={report.path} to={report.path}>
              <Card className="transition-all hover:shadow-lg hover:-translate-y-1">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className={`rounded-xl p-2 ${report.color}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <CardTitle className="text-base">{report.title}</CardTitle>
                  </div>
                  <CardDescription>{report.description}</CardDescription>
                </CardHeader>
                <CardContent className="flex justify-end">
                  <ArrowRight className="h-5 w-5 text-neutral-400" />
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}