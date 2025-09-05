import {
  RequestIndividualRegistrationOutputDto,
  RequestIndividualRegistrationInputDto,
  GetMyPendingRegistrationsListItemView,
  RequestDuoRegistrationOutputDto,
  SearchMyRegistrationsFilter,
  RequestDuoRegistrationDto,
  SearchMyRegistrationView,
  CancelRegistrationDto,
} from '@/contracts/api/registration.dto';

export interface RegistrationsGateway {
  requestDuoCompetitorRegistration(input: RequestDuoRegistrationDto): Promise<RequestDuoRegistrationOutputDto>;
  acceptDuoCompetitorRegistration(id: string): Promise<void>;
  rejectDuoCompetitorRegistration(id: string): Promise<void>;
  cancelCompetitorRegistration(input: CancelRegistrationDto): Promise<void>;
  registerIndividualCompetitor(input: RequestIndividualRegistrationInputDto): Promise<RequestIndividualRegistrationOutputDto>;
  findMyPendingRegistrations(): Promise<GetMyPendingRegistrationsListItemView[]>;
  searchMyRegistrations(filter?: SearchMyRegistrationsFilter): Promise<SearchMyRegistrationView>;
}
