import { Building2, Package, Users, FileText, DollarSign, TrendingUp, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const features = [
  {
    icon: Users,
    title: 'Client Management',
    description: 'Manage your clients, contacts, and business relationships',
  },
  {
    icon: Package,
    title: 'Products & Services',
    description: 'Track your product catalog and service offerings',
  },
  {
    icon: FileText,
    title: 'Invoicing',
    description: 'Generate and manage invoices with payment tracking',
  },
  {
    icon: DollarSign,
    title: 'Expense Tracking',
    description: 'Monitor business expenses like rent, utilities, and salaries',
  },
  {
    icon: Users,
    title: 'Employee Management',
    description: 'Manage non-driver employees and payroll',
  },
  {
    icon: TrendingUp,
    title: 'Financial Reports',
    description: 'Profit and loss statements, monthly and yearly reports',
  },
];

export default function BusinessSystem() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <div className="mb-4 flex justify-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-primary shadow-glow">
            <Building2 className="h-8 w-8 text-primary-foreground" />
          </div>
        </div>
        <h1 className="font-display text-4xl font-bold tracking-tight">
          General Business Management
        </h1>
        <p className="mx-auto mt-3 max-w-2xl text-lg text-muted-foreground">
          A complete system for managing non-transport business activities including clients, 
          products, invoicing, and financial reporting.
        </p>
      </div>

      {/* Features Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {features.map((feature, index) => (
          <div
            key={feature.title}
            className="group relative overflow-hidden rounded-xl border bg-card p-6 shadow-sm transition-all duration-300 hover:shadow-lg animate-slide-up"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10 text-accent transition-colors group-hover:bg-accent group-hover:text-accent-foreground">
              <feature.icon className="h-6 w-6" />
            </div>
            <h3 className="mt-4 font-display text-lg font-semibold">{feature.title}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{feature.description}</p>
            
            {/* Decorative gradient line */}
            <div className="absolute bottom-0 left-0 h-1 w-full bg-gradient-primary opacity-0 transition-opacity group-hover:opacity-100" />
          </div>
        ))}
      </div>

      {/* CTA Section */}
      <div className="rounded-2xl bg-gradient-dark p-8 text-center text-secondary-foreground">
        <h2 className="font-display text-2xl font-bold">Ready to Get Started?</h2>
        <p className="mx-auto mt-2 max-w-xl text-secondary-foreground/80">
          This module is designed to work independently from truck operations, 
          providing a complete solution for your general business needs.
        </p>
        <div className="mt-6 flex justify-center gap-4">
          <Button variant="gradient" size="lg" className="gap-2">
            Configure Business System
            <ArrowRight className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="lg" className="border-secondary-foreground/20 text-secondary-foreground hover:bg-secondary-foreground/10">
            View Documentation
          </Button>
        </div>
      </div>

      {/* Architecture Note */}
      <div className="rounded-xl border bg-card p-6 shadow-sm">
        <h3 className="font-display text-lg font-semibold">System Architecture</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          As per the suggested architecture, this Business Management System is designed as a 
          separate module that can operate independently. Future enhancements may include 
          shared authentication and reporting services with the Truck Management System.
        </p>
        <div className="mt-4 flex gap-4">
          <Link to="/">
            <Button variant="outline" size="sm" className="gap-2">
              <ArrowRight className="h-4 w-4 rotate-180" />
              Back to Fleet Dashboard
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
