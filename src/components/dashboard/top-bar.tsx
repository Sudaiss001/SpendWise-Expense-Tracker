'use client';

import { useState } from 'react';
import { Banknote, Plus, LogOut, ChevronDown, Download, FileSpreadsheet, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useAuthStore } from '@/store/auth-store';
import { useExpenseStore } from '@/store/expense-store';

interface TopBarProps {
  onAddExpense: () => void;
}

export default function TopBar({ onAddExpense }: TopBarProps) {
  const { user, logout } = useAuthStore();
  const exportCSV = useExpenseStore((s) => s.exportCSV);
  const exportPDFData = useExpenseStore((s) => s.exportPDFData);
  const [showExportMenu, setShowExportMenu] = useState(false);

  const handleExportCSV = () => {
    const csvContent = exportCSV();
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `spendwise-expenses-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    setShowExportMenu(false);
  };

  const handleExportPDF = () => {
    // Generate a simple printable HTML table and open as PDF via print dialog
    const expenses = exportPDFData();
    const formatNaira = (amount: number) =>
      new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(amount);

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>SpendWise Expense Report</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: 'Segoe UI', Tahoma, sans-serif; padding: 40px; color: #111827; }
          .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #8B5CF6; padding-bottom: 20px; }
          .header h1 { font-size: 24px; color: #111827; margin-bottom: 4px; }
          .header p { color: #6B7280; font-size: 14px; }
          .meta { display: flex; justify-content: space-between; margin-bottom: 20px; font-size: 13px; color: #6B7280; }
          table { width: 100%; border-collapse: collapse; font-size: 13px; }
          thead th { background: #F3F4F6; text-align: left; padding: 10px 12px; font-weight: 600; color: #374151; border-bottom: 2px solid #E5E7EB; text-transform: uppercase; font-size: 11px; letter-spacing: 0.5px; }
          tbody td { padding: 10px 12px; border-bottom: 1px solid #F3F4F6; }
          tbody tr:hover { background: #F9FAFB; }
          .amount { text-align: right; font-weight: 600; color: #EF4444; }
          .total-row { background: #F3F4F6 !important; font-weight: 700; }
          .total-row td { border-top: 2px solid #E5E7EB; font-size: 14px; }
          .category { display: inline-block; padding: 2px 8px; border-radius: 10px; font-size: 11px; background: #F3F4F6; color: #374151; }
          .footer { margin-top: 30px; text-align: center; color: #9CA3AF; font-size: 11px; border-top: 1px solid #E5E7EB; padding-top: 15px; }
          @media print { body { padding: 20px; } }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>SpendWise - Expense Report</h1>
          <p>${user?.businessName || 'My Business'} &bull; Generated on ${new Date().toLocaleDateString('en-NG', { day: '2-digit', month: 'long', year: 'numeric' })}</p>
        </div>
        <div class="meta">
          <span>Total Transactions: ${expenses.length}</span>
          <span>Total Amount: ${formatNaira(expenses.reduce((s, e) => s + e.amount, 0))}</span>
        </div>
        <table>
          <thead>
            <tr><th>Date</th><th>Vendor</th><th>Category</th><th>Payment</th><th class="amount">Amount (₦)</th></tr>
          </thead>
          <tbody>
            ${expenses.map((e) => `
              <tr>
                <td>${e.date}</td>
                <td>${e.vendor}${e.description ? '<br><small style="color:#9CA3AF">' + e.description + '</small>' : ''}</td>
                <td><span class="category">${e.category}</span></td>
                <td>${e.paymentMethod}</td>
                <td class="amount">${formatNaira(e.amount)}</td>
              </tr>
            `).join('')}
            <tr class="total-row">
              <td colspan="4" style="text-align:right">Total</td>
              <td class="amount">${formatNaira(expenses.reduce((s, e) => s + e.amount, 0))}</td>
            </tr>
          </tbody>
        </table>
        <div class="footer">
          <p>SpendWise SME Expense Tracker &bull; Built for Nigerian Businesses &bull; ${new Date().getFullYear()}</p>
        </div>
      </body>
      </html>
    `;

    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(html);
      printWindow.document.close();
      printWindow.onload = () => {
        printWindow.print();
      };
    }
    setShowExportMenu(false);
  };

  return (
    <header className="glass-subtle sticky top-0 z-50">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left side */}
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-violet-500 to-emerald-400 flex items-center justify-center">
              <Banknote className="w-5 h-5 text-white" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-sm font-bold text-white leading-none">
                {user?.businessName || 'My Business'}
              </h1>
              <p className="text-xs text-muted-foreground mt-0.5">Expense Dashboard</p>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full glass text-sm">
              <span className="text-emerald font-bold">₦</span>
              <span className="text-muted-foreground text-xs hidden sm:inline">NGN</span>
            </div>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Export Dropdown */}
            <div className="relative">
              <DropdownMenu open={showExportMenu} onOpenChange={setShowExportMenu}>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="border-white/10 text-muted-foreground hover:text-white hover:bg-white/5 hover:border-white/20 h-9 sm:h-10 px-2 sm:px-3 text-sm"
                  >
                    <Download className="w-4 h-4 sm:mr-1.5" />
                    <span className="hidden sm:inline">Export</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="w-52 bg-slate-card border-white/10 text-foreground"
                >
                  <DropdownMenuItem
                    onClick={handleExportCSV}
                    className="text-emerald focus:text-emerald focus:bg-emerald/10 cursor-pointer"
                  >
                    <FileSpreadsheet className="w-4 h-4 mr-2" />
                    Export as CSV
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={handleExportPDF}
                    className="text-violet focus:text-violet focus:bg-violet/10 cursor-pointer"
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    Export as PDF
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <Button
              onClick={onAddExpense}
              className="bg-violet hover:bg-violet/90 text-white font-semibold glow-violet transition-all duration-300 hover:scale-105 h-9 sm:h-10 px-3 sm:px-4 text-sm"
            >
              <Plus className="w-4 h-4 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">Add Expense</span>
              <span className="sm:hidden">Add</span>
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 p-1 rounded-full hover:bg-white/5 transition-colors">
                  <Avatar className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-emerald-400 flex items-center justify-center">
                    <AvatarFallback className="text-white text-xs font-bold bg-transparent">
                      {user?.avatarInitials || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <ChevronDown className="w-3.5 h-3.5 text-muted-foreground hidden sm:block" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-56 bg-slate-card border-white/10 text-foreground"
              >
                <div className="px-3 py-2 border-b border-white/10">
                  <p className="text-sm font-semibold text-white">
                    {user?.fullName}
                  </p>
                  <p className="text-xs text-muted-foreground">{user?.email}</p>
                </div>
                <DropdownMenuSeparator className="bg-white/10" />
                <DropdownMenuItem
                  onClick={logout}
                  className="text-crimson focus:text-crimson focus:bg-crimson/10 cursor-pointer"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Log Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
}
