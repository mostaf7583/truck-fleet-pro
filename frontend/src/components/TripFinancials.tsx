
import { useState } from 'react';
import { Plus, DollarSign, Calendar, CheckCircle2, Clock, AlertCircle, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { tripIncomeApi } from '@/lib/api';
import { TripIncome, PaymentStatus } from '@/types';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

interface TripFinancialsProps {
    tripId: string | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

const statusStyles = {
    PAID: 'bg-success/10 text-success border-success/20',
    PENDING: 'bg-warning/10 text-warning border-warning/20',
    OVERDUE: 'bg-destructive/10 text-destructive border-destructive/20',
};

const statusIcons = {
    PAID: CheckCircle2,
    PENDING: Clock,
    OVERDUE: AlertCircle,
};

const statusLabels: Record<PaymentStatus, string> = {
    PAID: 'مدفوع',
    PENDING: 'معلق',
    OVERDUE: 'متأخر',
};

export function TripFinancials({ tripId, open, onOpenChange }: TripFinancialsProps) {
    const queryClient = useQueryClient();
    const { toast } = useToast();
    const [isAddingIncome, setIsAddingIncome] = useState(false);

    const { data: incomes = [], isLoading } = useQuery({
        queryKey: ['tripIncomes', tripId],
        queryFn: () => tripId ? tripIncomeApi.getByTripId(tripId) : Promise.resolve([]),
        enabled: !!tripId && open,
    });

    const createMutation = useMutation({
        mutationFn: tripIncomeApi.create,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tripIncomes', tripId] });
            setIsAddingIncome(false);
            toast({
                title: 'تم إضافة الدخل',
                description: 'تم تسجيل الدخل بنجاح.',
            });
        },
    });

    const updateMutation = useMutation({
        mutationFn: ({ id, data }: { id: string; data: Partial<TripIncome> }) => tripIncomeApi.update(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tripIncomes', tripId] });
            toast({
                title: 'تم تحديث الحالة',
                description: 'تم تحديث حالة الدفع بنجاح.',
            });
        },
    });

    const deleteMutation = useMutation({
        mutationFn: tripIncomeApi.delete,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tripIncomes', tripId] });
            toast({
                title: 'تم حذف الدخل',
                description: 'تم حذف سجل الدخل.',
                variant: 'destructive',
            });
        },
    });

    const handleAddIncome = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!tripId) return;

        const formData = new FormData(e.currentTarget);
        const data = {
            tripId,
            clientName: formData.get('clientName'),
            amount: Number(formData.get('amount')),
            paymentStatus: 'PENDING',
            dueDate: new Date(formData.get('dueDate') as string),
        };

        createMutation.mutate(data);
    };

    const handleStatusChange = (id: string, newStatus: PaymentStatus) => {
        updateMutation.mutate({
            id,
            data: {
                paymentStatus: newStatus,
                // If changing to PAID, set paidDate to now, else undefined (optional logic)
                paidDate: newStatus === 'PAID' ? new Date() : undefined
            }
        });
    };

    const handleDelete = (id: string) => {
        if (confirm('هل أنت متأكد من حذف هذا السجل؟')) {
            deleteMutation.mutate(id);
        }
    };

    const totalIncome = incomes.reduce((sum: number, item: TripIncome) => sum + item.amount, 0);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>المالية للرحلة</DialogTitle>
                    <DialogDescription>
                        إدارة الدخل والمصروفات لهذه الرحلة.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6">
                    {/* Summary Cards */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="rounded-xl border bg-card p-4 shadow-sm">
                            <p className="text-sm text-muted-foreground">إجمالي الدخل</p>
                            <p className="text-2xl font-bold text-success">
                                {totalIncome.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
                            </p>
                        </div>
                        {/* Placeholder for expenses */}
                        <div className="rounded-xl border bg-card p-4 shadow-sm">
                            <p className="text-sm text-muted-foreground">صافي الربح</p>
                            <p className="text-2xl font-bold">
                                {totalIncome.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
                            </p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h3 className="font-semibold">سجلات الدخل</h3>
                            <Button variant="outline" size="sm" onClick={() => setIsAddingIncome(!isAddingIncome)}>
                                {isAddingIncome ? 'إلغاء' : 'إضافة دخل'}
                            </Button>
                        </div>

                        {isAddingIncome && (
                            <form onSubmit={handleAddIncome} className="rounded-lg border p-4 space-y-4 bg-muted/50 animate-in fade-in slide-in-from-top-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="clientName">العميل</Label>
                                        <Input id="clientName" name="clientName" placeholder="اسم العميل" required />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="amount">المبلغ</Label>
                                        <Input id="amount" name="amount" type="number" placeholder="0.00" required />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="dueDate">تاريخ الاستحقاق</Label>
                                    <Input id="dueDate" name="dueDate" type="date" required />
                                </div>
                                <Button type="submit" size="sm" className="w-full">حفظ</Button>
                            </form>
                        )}

                        <div className="space-y-3">
                            {isLoading ? (
                                <p className="text-center text-muted-foreground">تحميل...</p>
                            ) : incomes.length === 0 ? (
                                <p className="text-center text-muted-foreground py-4">لا توجد سجلات دخل.</p>
                            ) : (
                                incomes.map((income: TripIncome) => {
                                    const StatusIcon = statusIcons[income.paymentStatus];
                                    return (
                                        <div key={income.id} className="flex items-center justify-between rounded-lg border p-3 hover:bg-muted/50 transition-colors">
                                            <div className="flex items-center gap-3">
                                                <div className="rounded-full bg-primary/10 p-2 text-primary">
                                                    <DollarSign className="h-4 w-4" />
                                                </div>
                                                <div>
                                                    <p className="font-medium">{income.clientName}</p>
                                                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                                        <Calendar className="h-3 w-3" />
                                                        {format(new Date(income.dueDate), 'MMM d, yyyy')}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-3">
                                                <p className="font-bold">
                                                    {income.amount.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
                                                </p>

                                                <Select
                                                    defaultValue={income.paymentStatus}
                                                    onValueChange={(value) => handleStatusChange(income.id, value as PaymentStatus)}
                                                >
                                                    <SelectTrigger className={cn("h-8 w-[100px]", statusStyles[income.paymentStatus])}>
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="PAID">مدفوع</SelectItem>
                                                        <SelectItem value="PENDING">معلق</SelectItem>
                                                        <SelectItem value="OVERDUE">متأخر</SelectItem>
                                                    </SelectContent>
                                                </Select>

                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                                                    onClick={() => handleDelete(income.id)}
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
