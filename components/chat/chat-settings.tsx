'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

type ChatSettingsProps = {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  isUrlSummaryEnabled: boolean;
  onUrlSummaryToggle: (enabled: boolean) => void;
};

export default function ChatSettings({
  isOpen,
  onOpenChange,
  isUrlSummaryEnabled,
  onUrlSummaryToggle,
}: ChatSettingsProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
          <DialogDescription>
            Customize your chat experience.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <div className="flex items-center justify-between space-x-2">
            <Label htmlFor="url-summary-switch" className="flex flex-col space-y-1">
              <span>Smart URL Summaries</span>
              <span className="font-normal leading-snug text-muted-foreground">
                Automatically generate and display summaries for URLs shared in the chat.
              </span>
            </Label>
            <Switch
              id="url-summary-switch"
              checked={isUrlSummaryEnabled}
              onCheckedChange={onUrlSummaryToggle}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
