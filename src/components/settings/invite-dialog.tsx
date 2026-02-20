"use client";

import { useState } from "react";
import { Check, Copy, Loader2, Send } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  onInvite: (email: string, role: "editor" | "viewer") => Promise<void>;
}

export function InviteDialog({ open, onOpenChange, onInvite }: InviteDialogProps) {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<"editor" | "viewer">("editor");
  const [sending, setSending] = useState(false);
  const [invited, setInvited] = useState(false);
  const [copied, setCopied] = useState(false);

  const appUrl = typeof window !== "undefined" ? window.location.origin : "";

  const handleSend = async () => {
    if (!email.trim()) return;
    setSending(true);
    try {
      await onInvite(email.trim(), role);
      toast.success(`Invite sent to ${email}`);
      setInvited(true);
    } catch {
      toast.error("Failed to send invite");
    } finally {
      setSending(false);
    }
  };

  const handleCopyLink = async () => {
    const text = `You've been invited to collaborate on our home interiors project on HomeBase! Sign in with ${email} at:\n${appUrl}`;
    await navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success("Copied! Share it via WhatsApp or message.");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClose = (isOpen: boolean) => {
    if (!isOpen) {
      setEmail("");
      setRole("editor");
      setInvited(false);
      setCopied(false);
    }
    onOpenChange(isOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{invited ? "Invite Sent" : "Invite Member"}</DialogTitle>
        </DialogHeader>

        {!invited ? (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Email</Label>
              <Input
                type="email"
                placeholder="family@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

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

            <Button className="w-full" onClick={handleSend} disabled={!email.trim() || sending}>
              {sending ? (
                <Loader2 className="mr-2 size-4 animate-spin" />
              ) : (
                <Send className="mr-2 size-4" />
              )}
              Send Invite
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="rounded-lg bg-green-500/10 border border-green-500/20 p-4 text-center space-y-1">
              <Check className="size-8 text-green-400 mx-auto" />
              <p className="text-sm font-medium">
                Invite created for {email}
              </p>
              <p className="text-xs text-muted-foreground">
                They need to sign in with this exact email to join.
              </p>
            </div>

            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">
                Share this message with them via WhatsApp / SMS:
              </Label>
              <div className="rounded-lg glass-card p-3 text-xs text-muted-foreground leading-relaxed">
                You&apos;ve been invited to collaborate on our home interiors project on HomeBase! Sign in with <span className="font-medium text-foreground">{email}</span> at:
                <br />
                <span className="font-medium text-primary break-all">{appUrl}</span>
              </div>
            </div>

            <Button variant="outline" className="w-full" onClick={handleCopyLink}>
              {copied ? (
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
