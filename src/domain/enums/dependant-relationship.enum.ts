// src/domain/enums/dependant-relationship.enum.ts

export enum DependantRelationship {
  DAUGHTER = 'DAUGHTER',
  HUSBAND = 'HUSBAND',
  CHILD = 'CHILD',
  WIFE = 'WIFE',
  SON = 'SON',
  OTHER = 'OTHER',
}

// Objeto de tradução adicionado para uso na UI
export const DependantRelationshipTranslation: Record<DependantRelationship, string> = {
  [DependantRelationship.SON]: 'Filho',
  [DependantRelationship.DAUGHTER]: 'Filha',
  [DependantRelationship.HUSBAND]: 'Marido',
  [DependantRelationship.WIFE]: 'Esposa',
  [DependantRelationship.CHILD]: 'Criança',
  [DependantRelationship.OTHER]: 'Outro',
};
