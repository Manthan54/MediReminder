
export const medicalKnowledgeBase = {
  greetings: [
    "Hello! I'm your medical assistant. I can provide detailed information about medications, symptoms, and health recommendations. How can I help you today?",
    "Welcome! I can assist you with medical information, medication guidance, and health advice. What would you like to know?"
  ],
  
  medications: {
    painRelievers: {
      general: "Pain relievers are medications that reduce or eliminate pain. They work in different ways and should be chosen based on the type and severity of pain.",
      types: {
        otc: {
          acetaminophen: {
            brandNames: ["Tylenol", "Paracetamol"],
            dosage: "Adults: 325-650mg every 4-6 hours. Maximum 3000mg daily.",
            uses: "Mild to moderate pain, fever reduction",
            sideEffects: "Generally well tolerated. Rare liver problems with overdose.",
            warnings: "Avoid alcohol. Don't exceed recommended dose. Check other medications for acetaminophen content.",
            interactions: ["Alcohol", "Other acetaminophen-containing products"]
          },
          ibuprofen: {
            brandNames: ["Advil", "Motrin"],
            dosage: "Adults: 200-400mg every 4-6 hours. Maximum 1200mg daily.",
            uses: "Pain, inflammation, fever",
            sideEffects: "Stomach upset, increased bleeding risk, kidney stress",
            warnings: "Take with food. Not for long-term use without medical supervision.",
            interactions: ["Blood thinners", "ACE inhibitors", "Diuretics"]
          }
        }
      }
    },
    antibiotics: {
      general: "Antibiotics treat bacterial infections. They require prescription and should only be taken as directed by a healthcare provider.",
      commonTypes: {
        penicillins: {
          amoxicillin: {
            uses: "Respiratory infections, ear infections, urinary tract infections",
            dosage: "Varies by condition and age. Typically 250-500mg every 8 hours.",
            sideEffects: "Diarrhea, nausea, rash",
            warnings: "Complete full course. Alert doctor if allergic to penicillin."
          }
        }
      }
    }
  },

  conditions: {
    respiratory: {
      commonCold: {
        symptoms: ["Runny nose", "Congestion", "Sore throat", "Cough", "Mild fever"],
        treatment: "Rest, hydration, over-the-counter medications for symptom relief",
        medications: ["Decongestants", "Pain relievers", "Cough suppressants"],
        whenToSeekHelp: ["Fever over 101.3°F", "Difficulty breathing", "Symptoms lasting >10 days"]
      },
      flu: {
        symptoms: ["High fever", "Body aches", "Fatigue", "Cough", "Headache"],
        treatment: "Rest, fluids, antiviral medications if prescribed early",
        medications: ["Oseltamivir (Tamiflu)", "Pain relievers", "Decongestants"],
        prevention: ["Annual flu vaccine", "Hand washing", "Avoiding sick contacts"]
      }
    },
    digestive: {
      gastritis: {
        symptoms: ["Stomach pain", "Nausea", "Bloating", "Loss of appetite"],
        treatment: "Dietary changes, acid reducers, avoid triggers",
        medications: ["Antacids", "H2 blockers", "Proton pump inhibitors"],
        lifestyle: ["Avoid spicy foods", "Eat smaller meals", "Limit alcohol"]
      }
    }
  },

  emergencySymptoms: [
    "Chest pain or pressure",
    "Difficulty breathing",
    "Severe abdominal pain",
    "Sudden severe headache",
    "Signs of stroke (FAST: Face drooping, Arm weakness, Speech difficulty, Time to call emergency)",
    "Loss of consciousness"
  ]
};

export const generateResponse = (query: string): string => {
  const lowerQuery = query.toLowerCase();
  let response = "";

  // Helper function to format medication info
  const formatMedicationInfo = (med: any, name: string) => {
    return `${name}:
    - Typical Usage: ${med.uses}
    - Recommended Dosage: ${med.dosage}
    - Common Side Effects: ${med.sideEffects}
    - Important Warnings: ${med.warnings}
    ${med.brandNames ? `- Available as: ${med.brandNames.join(', ')}` : ''}
    ${med.interactions ? `- Known Interactions: ${med.interactions.join(', ')}` : ''}`;
  };

  // Check for emergency symptoms first
  const emergencyTerms = ['chest pain', 'breathing', 'unconscious', 'stroke', 'heart attack'];
  if (emergencyTerms.some(term => lowerQuery.includes(term))) {
    return "⚠️ MEDICAL EMERGENCY WARNING: If you're experiencing these symptoms, please call emergency services immediately or go to the nearest emergency room. This is not a substitute for emergency medical care.";
  }

  // Medication queries
  if (lowerQuery.includes('tylenol') || lowerQuery.includes('acetaminophen')) {
    response = formatMedicationInfo(medicalKnowledgeBase.medications.painRelievers.types.otc.acetaminophen, 'Acetaminophen (Tylenol)');
  } 
  else if (lowerQuery.includes('advil') || lowerQuery.includes('ibuprofen')) {
    response = formatMedicationInfo(medicalKnowledgeBase.medications.painRelievers.types.otc.ibuprofen, 'Ibuprofen (Advil)');
  }
  else if (lowerQuery.includes('amoxicillin')) {
    response = formatMedicationInfo(medicalKnowledgeBase.medications.antibiotics.commonTypes.penicillins.amoxicillin, 'Amoxicillin');
  }

  // Condition queries
  else if (lowerQuery.includes('cold') || lowerQuery.includes('flu')) {
    const condition = lowerQuery.includes('cold') ? 
      medicalKnowledgeBase.conditions.respiratory.commonCold :
      medicalKnowledgeBase.conditions.respiratory.flu;
    
    response = `${lowerQuery.includes('cold') ? 'Common Cold' : 'Flu'} Information:
    Symptoms: ${condition.symptoms.join(', ')}
    Recommended Treatment: ${condition.treatment}
    Suggested Medications: ${condition.medications.join(', ')}`;
    
    // Add conditional properties with proper type checking
    if ('whenToSeekHelp' in condition) {
      response += `\nWhen to Seek Medical Help: ${condition.whenToSeekHelp.join(', ')}`;
    }
    
    if ('prevention' in condition) {
      response += `\nPrevention: ${condition.prevention.join(', ')}`;
    }
  }
  
  else if (lowerQuery.includes('stomach') || lowerQuery.includes('gastritis')) {
    const gastritis = medicalKnowledgeBase.conditions.digestive.gastritis;
    response = `Gastritis Information:
    Symptoms: ${gastritis.symptoms.join(', ')}
    Treatment Approach: ${gastritis.treatment}
    Recommended Medications: ${gastritis.medications.join(', ')}
    Lifestyle Changes: ${gastritis.lifestyle.join(', ')}`;
  }

  if (!response) {
    response = "I understand you're asking about health-related information. For the most accurate medical advice, please consult with a healthcare professional. I can provide general information about common medications, symptoms, and health practices. Could you please be more specific about what you'd like to know?";
  }

  response += "\n\n⚠️ IMPORTANT MEDICAL DISCLAIMER: This information is for educational purposes only and should not replace professional medical advice. Always consult with a qualified healthcare provider for diagnosis and treatment recommendations.";
  
  return response;
};
