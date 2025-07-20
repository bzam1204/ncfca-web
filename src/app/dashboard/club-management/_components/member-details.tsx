'use client';

import {ClubMemberDto} from "@/contracts/api/club-member.dto";
import {Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription} from "@/components/ui/dialog";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {Button} from "@/components/ui/button";
import {User, Phone, Mail, Shield, MessageSquare, VenusAndMars, CalendarIcon} from "lucide-react";
import {Sex} from "@/domain/enums/sex.enum";

interface MemberDetailsDialogProps {
  member: ClubMemberDto | null;
  onOpenChange: (isOpen: boolean) => void;
}

// Subcomponente para evitar repetição
const InfoField = ({icon : Icon, label, value}: {
  icon: React.ElementType,
  label: string,
  value: string | undefined | null
}) => (
    <div className="flex items-center gap-3 text-sm">
      <Icon className="h-4 w-4 text-muted-foreground" />
      <span className="font-semibold">{label}:</span>
      <span className="text-muted-foreground">{value || 'Não informado'}</span>
    </div>
);

export function MemberDetailsDialog({member, onOpenChange}: MemberDetailsDialogProps) {
  if (!member) return null;

  const handleWhatsAppClick = () => {
    if (!member.holder.phone) return;
    const sanitizedPhone = member.holder.phone.replace(/\D/g, '');
    // Assumindo DDI 55 para o Brasil. Isso deve ser parametrizado no futuro.
    window.open(`https://wa.me/55${sanitizedPhone}`, '_blank', 'noopener,noreferrer');
  };

  return (
      <Dialog open={!!member} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[480px]">
          <DialogHeader className="flex flex-col items-center text-center">
            <Avatar className="h-24 w-24 mb-4">
              {/* O backend ainda não fornece, então usamos um placeholder. */}
              <AvatarImage src={member.avatarUrl ?? `https://i.pravatar.cc/150?u=${member.firstName}`}
                           alt={`${member.firstName} ${member.lastName}`} />
              <AvatarFallback>{member.firstName.charAt(0)}{member.lastName.charAt(0)}</AvatarFallback>
            </Avatar>
            <DialogTitle className="text-2xl">{member.firstName} {member.lastName}</DialogTitle>
            <DialogDescription>
              Membro desde {new Date(member.memberSince).toLocaleDateString('pt-BR')}
            </DialogDescription>
          </DialogHeader>

          <div className="py-4 grid gap-6">
            <div>
              <h3 className="font-semibold mb-3 flex items-center"><User className="mr-2 h-4 w-4" /> Dados do Membro
              </h3>
              <div className="space-y-2 pl-6 border-l">
                <InfoField icon={CalendarIcon} label="Nascimento"                           value={new Date(member.birthDate).toLocaleDateString('pt-BR')} />
                <InfoField icon={Phone} label="Telefone" value={member.phone} />
                <InfoField icon={Mail} label="Email" value={member.email} />
                <InfoField icon={VenusAndMars} label="Sexo"                           value={member.sex === Sex.FEMALE ? 'Feminino' : 'Masculino'} />
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-3 flex items-center"><Shield
                  className="mr-2 h-4 w-4" /> Dados do Responsável</h3>
              <div className="space-y-2 pl-6 border-l">
                <InfoField icon={User} label="Nome" value={`${member.holder.firstName} ${member.holder.lastName}`} />
                <InfoField icon={Mail} label="Email" value={member.holder.email} />
                <InfoField icon={Phone} label="Telefone" value={member.holder.phone} />
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
