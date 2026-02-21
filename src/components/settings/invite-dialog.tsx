"use client";

import { useState } from "react";
import { Check, Copy, Loader2, Ticket } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

interface InviteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onInvite: (role: "editor" | "viewer") => Promise<string>;
}

export function InviteDialog({ open, onOpenChange, onInvite }: InviteDialogProps) {
  const [role, setRole] = useState<"editor" | "viewer">("editor");
  const [generating, setGenerating] = useState(false);
  const [code, setCode] = useState<string | null>(null);
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedMsg, setCopiedMsg] = useState(false);

  const appUrl = typeof window !== "undefined" ? window.location.origin : "";

  const handleGenerate = async () => {
    setGenerating(true);
    try {
      const generatedCode = await onInvite(role);
      setCode(generatedCode);
      toast.success("Invite code generated!");
    } catch {
      toast.error("Failed to generate invite code");
    } finally {
      setGenerating(false);
    }
  };

  const handleCopyCode = async () => {
    if (!code) return;
    await navigator.clipboard.writeText(code);
    setCopiedCode(true);
    toast.success("Code copied!");
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleCopyMessage = async () => {
    const text = `You've been invited to collaborate on our home interiors project on HomeBase!\n\nYour invite code: ${code}\n\nSign in at ${appUrl} and enter the code to join.`;
    await navigator.clipboard.writeText(text);
    setCopiedMsg(true);
    toast.success("Message copied! Share it via WhatsApp or SMS.");
    setTimeout(() => setCopiedMsg(false), 2000);
  };

  const handleClose = (isOpen: boolean) => {
    if (!isOpen) {
      setRole("editor");
      setCode(null);
      setCopiedCode(false);
      setCopiedMsg(false);
    }
    onOpenChange(isOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{code ? "Invite Code Ready" : "Invite Member"}</DialogTitle>
        </DialogHeader>

        {!code ? (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Role</Label>
              <Select value={role} onValueChange={(v) => setRole(v as "editor" | "viewer")}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="editor">Editor — can add & edit data</SelectItem>
                  <SelectItem value="viewer">Viewer — read-only access</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button className="w-full" onClick={handleGenerate} disabled={generating}>
              {generating ? (
                <Loader2 className="mr-2 size-4 animate-spin" />
              ) : (
                <Ticket className="mr-2 size-4" />
              )}
              Generate Invite Code
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="rounded-lg bg-green-500/10 border border-green-500/20 p-5 text-center space-y-3">
              <Check className="size-8 text-green-400 mx-auto" />
              <p className="text-xs text-muted-foreground">
                Share this code with your family member
              </p>
              <button
                onClick={handleCopyCode}
                className="block mx-auto text-3xl font-mono font-bold tracking-[0.3em] text-foreground hover:text-primary transition-colors cursor-pointer select-all"
              >
                {code}
              </button>
              <Button variant="outline" size="sm" onClick={handleCopyCode}>
                {copiedCode ? (
                  <>
                    <Check className="mr-1.5 size-3.5 text-green-400" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="mr-1.5 size-3.5" />
                    Copy Code
                  </>
                )}
              </Button>
            </div>

            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">
                Or share a message via WhatsApp / SMS:
              </Label>
              <div className="rounded-lg glass-card p-3 text-xs text-muted-foreground leading-relaxed">
                You&apos;ve been invited to collaborate on our home interiors project on HomeBase!
                <br /><br />
                Your invite code: <span className="font-mono font-bold text-foreground tracking-wider">{code}</span>
                <br /><br />
                Sign in at <span className="font-medium text-primary break-all">{appUrl}</span> and enter the code to join.
              </div>
            </div>

            <Button variant="outline" className="w-full" onClick={handleCopyMessage}>
              {copiedMsg ? (
                <>
                  <Check className="mr-2 size-4 text-green-400" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="mr-2 size-4" />
                  Copy Invite Message
                </>
              )}
            </Button>

            <Button className="w-full" onClick={() => handleClose(false)}>
              Done
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
