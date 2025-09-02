'use client';

import { ClubMemberDto } from '@/contracts/api/club-member.dto';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { User, Phone, Mail, MessageSquare, VenusAndMars, Badge, CalendarIcon, Shield } from 'lucide-react';

interface MemberDetailsDialogProps {
  member: ClubMemberDto | null;
  onOpenChange: (isOpen: boolean) => void;
}

const InfoField = ({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string | undefined | null }) => (
  <div className="flex items-center gap-3 text-sm">
    <Icon className="h-4 w-4 text-muted-foreground" />
    <span className="font-semibold">{label}:</span>
    <span className="text-muted-foreground">{value || 'Não informado'}</span>
  </div>
);

export function MemberDetailsDialog({ member, onOpenChange }: MemberDetailsDialogProps) {
  if (!member) return null;

  const handleWhatsAppClick = () => {
    if (!member.holder.phone) return;
    const sanitizedPhone = member.holder.phone.replace(/\D/g, '');
    window.open(`https://wa.me/55${sanitizedPhone}`, '_blank', 'noopener,noreferrer');
  };

  return (
    <Dialog open={!!member} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader className="flex flex-col items-center text-center">
          <DialogTitle className="text-2xl">
            {member.firstName} {member.lastName}
          </DialogTitle>
          <DialogDescription>Membro desde {new Date(member.memberSince).toLocaleDateString('pt-BR')}</DialogDescription>
        </DialogHeader>

        <div className="py-4 grid gap-6">
          <div>
            <h3 className="font-semibold mb-3 flex items-center">
              <User className="mr-2 h-4 w-4" /> Dados do Membro
            </h3>
            <div className="space-y-2 pl-6 border-l">
              <InfoField icon={CalendarIcon} label="Nascimento" value={new Date(member.birthDate).toLocaleDateString('pt-BR')} />
              <InfoField icon={VenusAndMars} label="Sexo" value={member.sex === 'MALE' ? 'Masculino' : 'Feminino'} />
              <InfoField icon={Phone} label="Telefone" value={member.phone} />
              <InfoField icon={Mail} label="Email" value={member.email} />
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-3 flex items-center">
              <Shield className="mr-2 h-4 w-4" /> Dados do Responsável
            </h3>
            <div className="space-y-2 pl-6 border-l">
              <InfoField icon={User} label="Nome" value={`${member.holder.firstName} ${member.holder.lastName}`} />
              <InfoField icon={Mail} label="Email" value={member.holder.email} />
              <InfoField icon={Phone} label="Telefone" value={member.holder.phone} />
              <InfoField icon={Badge} label="CPF" value={member.holder.cpf} />
            </div>
          </div>
        </div>

        <Button onClick={handleWhatsAppClick} disabled={!member.holder.phone} className="w-full">
          <MessageSquare className="mr-2 h-4 w-4" />
          Contatar Responsável no WhatsApp
        </Button>
      </DialogContent>
    </Dialog>
  );
}
