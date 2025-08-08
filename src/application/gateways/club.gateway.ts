import {Club} from "@/domain/entities/entities";

export interface ClubGateway {
  myClub(): Promise<Club>;
}
