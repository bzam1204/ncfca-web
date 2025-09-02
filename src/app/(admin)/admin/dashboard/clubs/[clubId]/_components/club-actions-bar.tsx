'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { Edit, UserCheck, ExternalLink } from 'lucide-react';
import { Club } from '@/domain/entities/entities';
import { AdminEditClubForm } from './admin-edit-club-form';
import { ChangePrincipalDialog } from './change-principal-dialog';

interface ClubActionsBarProps {
  club: Club;
}

export function ClubActionsBar({ club }: ClubActionsBarProps) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isChangePrincipalModalOpen, setIsChangePrincipalModalOpen] = useState(false);

  return (
    <>
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href={`/admin/dashboard/users/${club.principalId}`}>
              <Button variant="outline" size="sm">
                <ExternalLink className="mr-2 h-4 w-4" />
                Ver Diretor
              </Button>
            </Link>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => setIsChangePrincipalModalOpen(true)}>
              <UserCheck className="mr-2 h-4 w-4" />
              Mudar Diretor
            </Button>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Edit className="mr-2 h-4 w-4" />
                Editar Clube
              </Button>
            </DialogTrigger>
          </div>
        </div>
        <AdminEditClubForm club={club} onSuccess={() => setIsEditModalOpen(false)} />
      </Dialog>

      <ChangePrincipalDialog isOpen={isChangePrincipalModalOpen} club={club} onClose={() => setIsChangePrincipalModalOpen(false)} />
    </>
  );
}
