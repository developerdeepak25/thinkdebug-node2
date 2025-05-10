import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, XCircle, AlertTriangle } from "lucide-react";

type EmailResult = {
  to: string;
  status: "success" | "failed";
  messageId?: string;
  threadId?: string;
  error?: string;
};

export type EmailSendResult = {
  status: "success" | "partial" | "error";
  summary: {
    total: number;
    successful: number;
    failed: number;
  };
  details: {
    successful: EmailResult[];
    failed: EmailResult[];
  };
};

interface EmailSendResultModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  result: EmailSendResult | null;
}

export default function EmailSendResultModal({
  open,
  onOpenChange,
  result,
}: EmailSendResultModalProps) {
  if (!result) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Email Send Summary
            {result.status === "success" && (
              <Badge className="ml-2 bg-green-600">All Sent</Badge>
            )}
            {result.status === "partial" && (
              <Badge className="ml-2 bg-orange-500">Partial Success</Badge>
            )}
            {result.status === "error" && (
              <Badge className="ml-2 bg-red-600">Error</Badge>
            )}
          </DialogTitle>
        </DialogHeader>
        <div className="mb-2">
          <div>
            <strong>Total:</strong> {result.summary.total}
          </div>
          <div className="text-green-700">
            <strong>Successful:</strong> {result.summary.successful}
          </div>
          <div className="text-red-700">
            <strong>Failed:</strong> {result.summary.failed}
          </div>
        </div>
        <div>
          <div className="font-semibold mb-1">Successful Emails:</div>
          {result.details.successful.length === 0 && (
            <div className="text-muted-foreground text-sm">None</div>
          )}
          {result.details.successful.map((item, idx) => (
            <div key={idx} className="flex items-center gap-2 text-green-700 mb-1">
              <CheckCircle2 className="w-4 h-4" />
              <span>{item.to}</span>
              {/* <span className="text-xs text-muted-foreground">(ID: {item.messageId})</span> */}
            </div>
          ))}
        </div>
        <div>
          <div className="font-semibold mb-1 mt-2">Failed Emails:</div>
          {result.details.failed.length === 0 && (
            <div className="text-muted-foreground text-sm">None</div>
          )}
          {result.details.failed.map((item, idx) => (
            <div key={idx} className="flex items-center gap-2 text-red-700 mb-1">
              <XCircle className="w-4 h-4" />
              <span>{item.to}</span>
              <span className="text-xs">{item.error}</span>
            </div>
          ))}
        </div>
        {result.status === "partial" && (
          <div className="flex items-center gap-2 text-orange-600 mt-2">
            <AlertTriangle className="w-4 h-4" />
            Some emails failed to send.
          </div>
        )}
        {/* <DialogFooter>
          <DialogClose asChild>
            <button className="btn btn-primary">Close</button>
          </DialogClose>
        </DialogFooter> */}
      </DialogContent>
    </Dialog>
  );
}
