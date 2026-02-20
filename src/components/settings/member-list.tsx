"use client";

import { useState } from "react";
import { Clock, Crown, MoreVertical, Pencil, Trash2, UserPlus, Eye } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { InviteDialog } from "./invite-dialog";
import { useMembers } from "@/lib/hooks/use-members";
import { useAuth } from "@/lib/providers/auth-provider";
import { useProject } from "@/lib/providers/project-provider";
import { toast } from "sonner";
import type { ProjectInvite } from "@/lib/types/project";

export function MemberList() {
  const { user } = useAuth();
  const { project } = useProject();
  const {
    memberUids,
    invites,
    isOwner,
    inviteMember,
    cancelInvite,
    removeMember,
  } = useMembers();
  const [showInvite, setShowInvite] = useState(false);

  const pendingInvites = invites.filter((i) => i.status === "pending");

  const handleRemove = async (uid: string) => {
    await removeMember(uid);
    toast.success("Member removed");
  };

  const handleCancel = async (inviteId: string) => {
    await cancelInvite(inviteId);
    toast.success("Invite cancelled");
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold">Members</h2>
        {isOwner && (
          <Button variant="outline" size="sm" onClick={() => setShowInvite(true)}>
            <UserPlus className="mr-2 size-3.5" />
            Invite
          </Button>
        )}
      </div>

      <div className="space-y-2">
        {/* Active members */}
        {memberUids.map((uid) => {
          const isSelf = uid === user?.uid;
          const isProjectOwner = uid === project?.ownerId;

          return (
            <div
              key={uid}
              className="flex items-center gap-3 rounded-lg glass-card p-3"
            >
              <Avatar className="size-9">
                <AvatarFallback className="text-xs">
                  {isProjectOwner ? "O" : "M"}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">
                  {isSelf ? `${user?.displayName || "You"} (you)` : `Member`}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {isSelf ? user?.email : uid.slice(0, 8) + "..."}
                </p>
              </div>
              <Badge variant={isProjectOwner ? "default" : "secondary"} className="shrink-0">
                {isProjectOwner ? (
                  <>
                    <Crown className="mr-1 size-3" />
                    Owner
                  </>
                ) : (
                  <>
                    <Pencil className="mr-1 size-3" />
                    Editor
                  </>
                )}
              </Badge>
              {isOwner && !isProjectOwner && !isSelf && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="size-7 shrink-0">
                      <MoreVertical className="size-3.5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={() => handleRemove(uid)}
                      className="text-destructive"
                    >
                      <Trash2 className="mr-2 size-3.5" />
                      Remove
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          );
        })}

        {/* Pending invites */}
        {pendingInvites.map((invite) => (
          <div
            key={invite.id}
            className="flex items-center gap-3 rounded-lg glass-card p-3 opacity-70"
          >
            <Avatar className="size-9">
              <AvatarFallback className="text-xs">
                <Clock className="size-4" />
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{invite.email}</p>
              <p className="text-xs text-muted-foreground">Pending invite</p>
            </div>
            <Badge variant="outline" className="shrink-0">
              {invite.role === "editor" ? (
                <>
                  <Pencil className="mr-1 size-3" />
                  Editor
                </>
              ) : (
                <>
                  <Eye className="mr-1 size-3" />
                  Viewer
                </>
              )}
            </Badge>
            {isOwner && (
              <Button
                variant="ghost"
                size="icon"
                className="size-7 shrink-0"
                onClick={() => handleCancel(invite.id)}
              >
                <Trash2 className="size-3.5 text-destructive" />
              </Button>
            )}
          </div>
        ))}
      </div>

      <InviteDialog
        open={showInvite}
        onOpenChange={setShowInvite}
        onInvite={inviteMember}
      />
    </div>
  );
}
