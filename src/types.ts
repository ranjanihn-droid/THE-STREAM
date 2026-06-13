export interface ProgramModule {
  id: string;
  title: string;
  description: string;
}

export interface TrainingProgram {
  title: string;
  duration: string;
  description: string;
  phase1Title: string;
  phase1Duration: string;
  phase1Modules: ProgramModule[];
  phase2Title: string;
  phase2Duration: string;
  phase2Description: string;
}

export interface ParentTrack {
  title: string;
  format: string;
  batchSize: string;
  intakeRhythm: string;
  fee: string;
  description: string;
}

export interface PartnerSchool {
  name: string;
  description: string;
  logoText: string;
  tagline: string;
}

export interface GalleryItem {
  imageSrc: string;
  title: string;
  description: string;
}

export interface LeadSubmission {
  name: string;
  email: string;
  message: string;
  submittedAt: string;
}
