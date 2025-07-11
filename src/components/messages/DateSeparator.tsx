import { formatMessageDate } from "@/utils/dateUtils";

interface DateSeparatorProps {
  date: string;
}

export function DateSeparator({ date }: DateSeparatorProps) {
  return (
    <div className="flex items-center justify-center my-4">
      <div className="bg-gray-200 px-3 py-1 rounded-full">
        <span className="text-xs text-gray-600 font-medium">
          {formatMessageDate(date)}
        </span>
      </div>
    </div>
  );
}