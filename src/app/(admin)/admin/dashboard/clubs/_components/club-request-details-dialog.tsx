'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ClubRequestStatusDto } from "@/contracts/api/club-management.dto";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { User, Phone, Mail, MapPin, Calendar, MessageSquare, Building2, Users, FileText, ExternalLink } from "lucide-react";
import { useAdminUserById } from "@/hooks/use-admin-user-by-id";

interface ClubRequestDetailsDialogProps {
  request: ClubRequestStatusDto | null;
  onOpenChange: (isOpen: boolean) => void;
}

const InfoField = ({ icon: Icon, label, value }: {
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

export function ClubRequestDetailsDialog({ request, onOpenChange }: ClubRequestDetailsDialogProps) {
  // Only fetch user data when dialog is open and we have a requesterId
  const shouldFetchUser = Boolean(request && request.requesterId);
  const { data: requesterData, isLoading: isLoadingRequester } = useAdminUserById(
    request?.requesterId || '', 
    shouldFetchUser
  );

  if (!request) return null;

  const handleWhatsAppClick = () => {
    if (!requesterData?.phone) return;
    const sanitizedPhone = requesterData.phone.replace(/\D/g, '');
    const message = encodeURIComponent(`Olá! Sobre sua solicitação de criação do clube "${request.clubName}".`);
    window.open(`https://wa.me/55${sanitizedPhone}?text=${message}`, '_blank', 'noopener,noreferrer');
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      PENDING: { label: 'Pendente', className: 'bg-yellow-100 text-yellow-800' },
      APPROVED: { label: 'Aprovado', className: 'bg-green-100 text-green-800' },
      REJECTED: { label: 'Rejeitado', className: 'bg-red-100 text-red-800' }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.PENDING;
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.className}`}>
        {config.label}
      </span>
    );
  };

  return (
    <Dialog open={!!request} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader className="flex flex-col items-center text-center">
          <DialogTitle className="text-2xl">Solicitação de Clube</DialogTitle>
          <DialogDescription className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Solicitado em {new Date(request.requestedAt).toLocaleDateString('pt-BR')}
          </DialogDescription>
        </DialogHeader>

        <div className="py-4 grid gap-6">
          {/* Club Information */}
          <div>
            <h3 className="font-semibold mb-3 flex items-center">
              <Building2 className="mr-2 h-4 w-4" /> Informações do Clube
            </h3>
            <div className="space-y-2 pl-6 border-l">
              <InfoField icon={Building2} label="Nome do Clube" value={request.clubName} />
              {request.maxMembers && (
                <InfoField icon={Users} label="Máximo de Membros" value={request.maxMembers.toString()} />
              )}
              <InfoField icon={FileText} label="Status" value={
                <span>{getStatusBadge(request.status)}</span>
              } />
              <InfoField icon={Calendar} label="Data da Solicitação" 
                value={new Date(request.requestedAt).toLocaleDateString('pt-BR')} />
              {request.resolvedAt && (
                <InfoField icon={Calendar} label="Data de Resolução" 
                  value={new Date(request.resolvedAt).toLocaleDateString('pt-BR')} />
              )}
              {request.rejectionReason && (
                <InfoField icon={FileText} label="Motivo da Rejeição" value={request.rejectionReason} />
              )}
            </div>
          </div>

          {/* Requester Information */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold flex items-center">
                <User className="mr-2 h-4 w-4" /> Dados do Solicitante
              </h3>
              {request.requesterId && (
                <Link href={`/admin/dashboard/users/${request.requesterId}`}>
                  <Button variant="outline" size="sm">
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Ver Usuário
                  </Button>
                </Link>
              )}
            </div>
            <div className="space-y-2 pl-6 border-l">
              {isLoadingRequester ? (
                <>
                  <Skeleton className="h-4 w-48" />
                  <Skeleton className="h-4 w-56" />
                  <Skeleton className="h-4 w-40" />
                </>
              ) : requesterData ? (
                <>
                  <InfoField icon={User} label="Nome" 
                    value={`${requesterData.firstName} ${requesterData.lastName}`} />
                  <InfoField icon={Mail} label="Email" value={requesterData.email} />
                  <InfoField icon={Phone} label="Telefone" value={requesterData.phone} />
                </>
              ) : (
                <div className="text-sm text-muted-foreground">
                  Informações do solicitante não disponíveis
                </div>
              )}
            </div>
          </div>

          {/* Address Information */}
          <div>
            <h3 className="font-semibold mb-3 flex items-center">
              <MapPin className="mr-2 h-4 w-4" /> Endereço do Clube
            </h3>
            <div className="space-y-2 pl-6 border-l">
              <InfoField icon={MapPin} label="Logradouro" 
                value={`${request.address.street || 'Não informado'}, ${request.address.number || 'S/N'}`} />
              <InfoField icon={MapPin} label="Bairro" value={request.address.district} />
              <InfoField icon={MapPin} label="Cidade / UF" 
                value={`${request.address.city} / ${request.address.state}`} />
              <InfoField icon={MapPin} label="CEP" value={request.address.zipCode} />
            </div>
          </div>

          {/* Additional Request Details */}
          <div>
            <h3 className="font-semibold mb-3 flex items-center">
              <FileText className="mr-2 h-4 w-4" /> Detalhes da Solicitação
            </h3>
            <div className="space-y-2 pl-6 border-l">
              <InfoField icon={FileText} label="ID da Solicitação" value={request.id} />
              <div className="text-sm text-muted-foreground">
                Esta é uma solicitação para criar um novo clube na plataforma.
                O solicitante deseja estabelecer o clube "{request.clubName}".
              </div>
            </div>
          </div>
        </div>

        {/* WhatsApp Contact Button */}
        <div className="flex gap-2">
          <Button 
            onClick={handleWhatsAppClick} 
            disabled={!requesterData?.phone} 
            className="flex-1"
          >
            <MessageSquare className="mr-2 h-4 w-4" />
            Contatar via WhatsApp
          </Button>
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            className="flex-1"
          >
            Fechar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}