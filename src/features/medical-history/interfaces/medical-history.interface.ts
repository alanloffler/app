export interface IMedicalHistory extends IMedicalHistoryCreate {
  createdAt: Date;
  deletedAt: Date;
  id: string;
  updatedAt: Date;
}

export interface IMedicalHistoryCreate {
  businessId: string;
  comments: string;
  date: Date;
  eventId?: string;
  reason: string;
  recipe: boolean;
  userId: string;
}
