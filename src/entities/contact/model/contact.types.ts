export interface IContactInfo {
  name: string;
  handle: string;
  titleFr: string;
  titleEn: string;
  subtitleFr: string;
  subtitleEn: string;
  email: string;
  phone: string;
  whatsappLink: string;
  location: string;
  website: string;
  repository: string;
  github: string;
  linkedin: string;
  facebook: string;
  youtube: string;
  /** Home/About presentation video (YouTube URL). */
  presentationVideoUrl: string;
}

export type ContactResponseStatus = 'new' | 'read' | 'archived' | 'replied';

export interface IContactResponse {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: ContactResponseStatus;
  createdAt: string;
  notes?: string;
}
