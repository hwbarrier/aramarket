import { MessageTemplateManager } from "./MessageTemplateManager";

interface MessageTemplatesPageProps {
  onPageChange: (page: string) => void;
}

export function MessageTemplatesPage({ onPageChange }: MessageTemplatesPageProps) {
  return (
    <div className="space-y-6">
      <MessageTemplateManager />
    </div>
  );
}