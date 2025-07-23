// src/app/(admin)/_components/manage-role-dialog.tsx
'use client';

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { UserDto } from "@/contracts/api/user.dto";
import { UserRoles } from "@/domain/enums/user.roles";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import {ManageUserRoleDto} from "@/contracts/api/admin.dto";

const roleSchema = z.object({
  roles: z.array(z.nativeEnum(UserRoles)).min(1, "O usuário deve ter pelo menos um perfil."),
});

interface ManageRoleDialogProps {
  isOpen: boolean;
  user: UserDto | null;
  isPending: boolean;
  onClose: () => void;
  onSubmit: (userId: string, data: ManageUserRoleDto) => void;
}

export function ManageRoleDialog({ isOpen, user, isPending, onClose, onSubmit }: ManageRoleDialogProps) {
  const { register, handleSubmit, reset, setValue, watch } = useForm<z.infer<typeof roleSchema>>({
    resolver: zodResolver(roleSchema),
  });

  const availableRoles = Object.values(UserRoles);
  const watchedRoles = watch('roles', user?.roles || []);

  useEffect(() => {
    if (user) {
      reset({ roles: user.roles });
    }
  }, [user, reset]);

  const handleFormSubmit = (data: z.infer<typeof roleSchema>) => {
    if (user) {
      onSubmit(user.id, data);
    }
  };

  return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Gerenciar Perfis de {user?.firstName}</DialogTitle>
            <DialogDescription>
              Atribua ou revogue perfis de acesso para este usuário.
            </DialogDescription>
          </DialogHeader>
          <form id="role-form" onSubmit={handleSubmit(handleFormSubmit)} className="py-4 space-y-4">
            <div className="space-y-2">
              {availableRoles.map(role => (
                  <div key={role} className="flex items-center gap-2">
                    <Checkbox
                        id={role}
                        value={role}
                        checked={watchedRoles.includes(role)}
                        onCheckedChange={(checked) => {
                          const currentRoles = watchedRoles || [];
                          const newRoles = checked
                              ? [...currentRoles, role]
                              : currentRoles.filter(r => r !== role);
                          setValue('roles', newRoles, { shouldValidate: true });
                        }}
                    />
                    <Label htmlFor={role}>{role}</Label>
                  </div>
              ))}
            </div>
          </form>
          <DialogFooter>
            <Button variant="ghost" onClick={onClose} disabled={isPending}>Cancelar</Button>
            <Button type="submit" form="role-form" disabled={isPending}>
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Salvar Alterações
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
  );
}
