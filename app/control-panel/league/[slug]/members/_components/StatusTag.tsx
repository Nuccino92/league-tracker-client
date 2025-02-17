import { MemberStatus } from '@/app/lib/types/Models/Member';
import { cn } from '@/app/lib/utils';

export default function StatusTag({ status }: { status: MemberStatus }) {
  const statusStyles = {
    accepted: 'bg-green-100 text-green-700 border-green-200',
    declined: 'bg-red-100 text-red-700 border-red-200',
    pending: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    suspended: 'bg-red-100 text-red-700 border-red-200',
  };

  const statusLabels = {
    accepted: 'Active',
    declined: 'Declined',
    pending: 'Pending',
    suspended: 'Suspended',
  };

  return (
    <div
      className={cn(
        'w-max rounded-full px-3 py-1 text-xs',
        statusStyles[status]
      )}
    >
      {statusLabels[status]}
    </div>
  );
}
