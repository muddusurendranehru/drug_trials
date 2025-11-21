export interface Trial {
  id: number;
  user_id: number;
  trial_acronym: string;
  trial_full_name: string;
  drug_name: string;
  result: string;
  brief_abstract: string;
  image_prompt: string | null;
  reference_article: string | null;
  created_at: string;
}

export interface TrialFormValues {
  trial_acronym: string;
  trial_full_name: string;
  drug_name: string;
  result: string;
  brief_abstract: string;
  image_prompt: string;
  reference_article: string;
}

export interface AiSearchResult {
  trial_acronym: string;
  trial_full_name: string;
  drug_name: string;
  result: string;
  brief_abstract: string;
  reference_article: string;
  source_label: string;
  confidence: string;
}

