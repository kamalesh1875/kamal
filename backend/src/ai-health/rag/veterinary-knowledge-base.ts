export interface VeterinaryKnowledgeDoc {
  id: string;
  conditionName: string;
  sourceAuthority: string;
  citation: string;
  symptoms: string[];
  clinicalSigns: string;
  pathologyAndCauses: string;
  differentialDiagnosis: string[];
  recommendedEmergencyProtocol: string;
  preventionAndVaccination: string;
  textChunk: string;
}

/**
 * Curated, Authoritative Small Ruminant Veterinary Knowledge Base (Section 28)
 * Sources:
 * - ICAR-Central Institute for Research on Goats (CIRG), Makhdoom
 * - TANUVAS (Tamil Nadu Veterinary and Animal Sciences University) Field Manual
 * - Merck Veterinary Manual (Caprine Medicine)
 * - FAO Clinical Manual on Small Ruminant Diseases
 */
export const VETERINARY_KNOWLEDGE_BASE: VeterinaryKnowledgeDoc[] = [
  {
    id: 'vet-ppr-01',
    conditionName: 'Peste des Petits Ruminants (PPR) / Goat Plague',
    sourceAuthority: 'ICAR-CIRG & TANUVAS Small Ruminant Advisory',
    citation: 'TANUVAS Clinical Guidelines for Caprine Viral Infections (2024)',
    symptoms: [
      'High pyrexia (104-106°F)',
      'Serous to mucopurulent oculonasal discharge',
      'Erosive stomatitis / necrotic mouth lesions',
      'Severe foul-smelling diarrhea',
      'Dyspnea and abdominal coughing'
    ],
    clinicalSigns:
      'Sudden high fever followed by bilateral crusty nasal discharge, congested conjunctiva, ulceration of gums/inner lips, and profuse dehydration diarrhea within 48-72 hours.',
    pathologyAndCauses:
      'Morbillivirus (Paramyxoviridae family). Highly contagious through aerosol droplets, direct contact, and shared water troughs.',
    differentialDiagnosis: ['Contagious Caprine Pleuropneumonia (CCPP)', 'Coccidiosis', 'Pasteurellosis'],
    recommendedEmergencyProtocol:
      'Immediate physical isolation into quarantine pen. Symptomatic therapy: Broad-spectrum antibiotic (Ceftiofur or Oxytetracycline) to prevent secondary bacterial pneumonia, fluid/electrolyte replacement, NSAID (Meloxicam) for fever. Inform attending veterinarian.',
    preventionAndVaccination:
      'Live attenuated PPR vaccine administered subcutaneously at 3-4 months of age; confers protective immunity for 3 years.',
    textChunk:
      'PPR causes high fever, necrotic mouth ulcers, crusty ocular-nasal discharge, and acute diarrhea. Mortality can reach 80% in unprotected herds. Secondary bacterial bronchopneumonia is common. Vaccination at 3 months provides robust herd immunity.'
  },
  {
    id: 'vet-et-02',
    conditionName: 'Enterotoxemia (Pulpy Kidney Disease)',
    sourceAuthority: 'TANUVAS Livestock Extension Bulletin',
    citation: 'Merck Veterinary Manual: Clostridial Diseases of Small Ruminants (11th Ed.)',
    symptoms: [
      'Sudden peracute death in fastest growing animals',
      'Opisthotonos (head thrown back)',
      'Severe abdominal pain, teeth grinding',
      'Frothing at mouth',
      'Terminal convulsions'
    ],
    clinicalSigns:
      'Often observed in high-condition fattening bucks suddenly switched to lush fodder or high-starch concentrate pellets. Animals exhibit sudden staggering, convulsions, hyperesthesia, and coma.',
    pathologyAndCauses:
      'Clostridium perfringens Type D epsilon toxin production in the presence of excess undigested starch spilling into the intestines.',
    differentialDiagnosis: ['Polioencephalomalacia (CCN)', 'Acute acidosis', 'Plant poisoning'],
    recommendedEmergencyProtocol:
      'Withhold all grain and concentrate rations immediately. Provide fibrous dry fodder (Napier/sorghum hay). Administer Clostridium Type D antitoxin serum if caught early, oral sodium bicarbonate, and antibiotic (Penicillin). Emergency vet call required.',
    preventionAndVaccination:
      'Annual Enterotoxemia (ET) alum-precipitated vaccine with booster 2 weeks before major dietary transition or onset of monsoon flush.',
    textChunk:
      'Enterotoxemia strikes fattening goats receiving rich concentrate rations. Caused by Clostridium perfringens Type D epsilon toxin proliferation. Characterized by teeth grinding, opisthotonos, and sudden mortality. Prevention relies on pre-monsoon ET vaccination and gradual feed transitions.'
  },
  {
    id: 'vet-pneu-03',
    conditionName: 'Caprine Enzootic Bronchopneumonia / Pasteurellosis',
    sourceAuthority: 'ICAR-CIRG Health Management Protocols',
    citation: 'CIRG Bulletin on Small Ruminant Respiratory Syndromes (2025)',
    symptoms: [
      'Tachypnea / shallow rapid breathing (>36 breaths/min)',
      'Mucoid or purulent nasal discharge',
      'Moist rales upon thoracic auscultation',
      'Hunched posture with lowered head',
      'Fever (103.5-105.0°F)'
    ],
    clinicalSigns:
      'Labored respiratory effort, bilateral crusting at nostrils, soft intermittent cough, depressed activity, and separation from the herd. Triggered by damp bedding, cold drafts, high shed ammonia (>15 ppm), or transport stress.',
    pathologyAndCauses:
      'Pasteurella multocida and Mannheimia haemolytica following viral or environmental immunosuppression.',
    differentialDiagnosis: ['PPR early phase', 'Lungworm infection (Dictyocaulus filaria)', 'Heat stress tachypnea'],
    recommendedEmergencyProtocol:
      'Long-acting Oxytetracycline (200mg/ml, 1ml/10kg IM) or Enrofloxacin, combined with Meloxicam (0.5mg/kg). Relocate animal to clean dry hospital pen with good cross-ventilation. Clear nostril crusts.',
    preventionAndVaccination:
      'Avoid overcrowding and damp floor conditions. Maintain ammonia <10 ppm. Hemorrhagic Septicemia / Pasteurellosis combined vaccine where endemic.',
    textChunk:
      'Pasteurellosis manifests as shallow fast breathing, moist rales, nasal discharge, and hunched posture. Ammonia levels above 15 ppm severely increase susceptibility. Standard treatment includes Oxytetracycline LA and anti-inflammatory support.'
  },
  {
    id: 'vet-cocc-04',
    conditionName: 'Coccidiosis (Eimeria infection)',
    sourceAuthority: 'FAO Small Ruminant Parasitology Manual',
    citation: 'FAO Small Ruminant Health Manual: Protozoal Diarrheal Syndromes (2024)',
    symptoms: [
      'Dark watery diarrhea, occasionally containing blood streaks or mucus',
      'Rough dry hair coat and dull eyes',
      'Abdominal gauntness / hollow flank',
      'Tenesmus (straining to defecate)',
      'Severe ADG growth stagnation'
    ],
    clinicalSigns:
      'Common in weaners and young growers (1-6 months old) housed in high-density pens with wet bedding. Subclinical cases show poor feed conversion and stunted weight gain without acute diarrhea.',
    pathologyAndCauses:
      'Eimeria ovinoidalis, E. arloingi, and E. ninakohlyakimovae disrupting intestinal epithelial microvilli.',
    differentialDiagnosis: ['Haemonchosis', 'Salmonellosis', 'Colibacillosis', 'Dietary nutritional scours'],
    recommendedEmergencyProtocol:
      'Isolate symptomatic kids. Administer oral Toltrazuril (20mg/kg single dose) or Sulfadimethoxine for 5 days. Oral electrolyte rehydration therapy to replace sodium and potassium loss.',
    preventionAndVaccination:
      'Keep feeder troughs raised above fecal contamination height. Keep slats clean and dry. Periodic fecal floatation tests.',
    textChunk:
      'Coccidiosis affects young kids and growers, causing watery or blood-tinged diarrhea, tenesmus, and growth stagnation. Transmitted via fecal-oral ingestion of sporulated oocysts in wet bedding. Treatment: Toltrazuril or Sulfonamides with rehydration salts.'
  },
  {
    id: 'vet-acid-05',
    conditionName: 'Acute Rumen Acidosis (Grain Overload)',
    sourceAuthority: 'TANUVAS Nutrition & Clinical Veterinary Medicine',
    citation: 'Veterinary Clinics of North America: Ruminant Digestive Disorders',
    symptoms: [
      'Severe anorexia / complete feed refusal',
      'Watery greyish pungent diarrhea',
      'Distended, sloshing left rumen flank',
      'Ataxia, weakness, staggered gait',
      'Severe dehydration and subnormal temperature in late stage'
    ],
    clinicalSigns:
      'Sudden gorging on concentrate grains (corn, wheat, broken rice, or flour). Rumen pH plummets below 5.0, destroying normal protozoal fauna and causing systemic lactic acidosis.',
    pathologyAndCauses:
      'Rapid fermentation of non-structural carbohydrates into D- and L-lactate by Streptococcus bovis and Lactobacillus spp.',
    differentialDiagnosis: ['Enterotoxemia', 'Hypocalcemia', 'Abdominal peritonitis'],
    recommendedEmergencyProtocol:
      'Withhold all grains immediately. Administer oral Sodium Bicarbonate (50-100g in 500ml warm water) or Magnesium Hydroxide to buffer rumen pH. Administer Thiamine (Vitamin B1) to prevent polioencephalomalacia. Contact vet for potential rumen lavage in severe cases.',
    preventionAndVaccination:
      'Store concentrate bags in locked rodent-proof feed rooms. Introduce grains gradually over a 14-day step-up period. Maintain minimum 40% roughage/fodder in daily dry matter intake.',
    textChunk:
      'Rumen acidosis results from accidental grain gorging, causing rumen pH to drop below 5.0. Symptoms include sloshy rumen, sweet-sour smelling watery diarrhea, and staggering. Immediate intervention: oral sodium bicarbonate buffer, Vitamin B1, and fibrous hay.'
  }
];
