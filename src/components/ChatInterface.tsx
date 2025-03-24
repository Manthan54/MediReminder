import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, RefreshCw, Mic, MicOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { motion, AnimatePresence } from 'framer-motion';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

// Comprehensive medical knowledge base
const medicalKnowledgeBase = {
  greetings: [
    "Hello! I'm your MediMinder health assistant. How can I help you with your medications today?",
    "Hi there! I'm here to provide information about medications and health-related topics. What can I assist you with?",
    "Welcome to MediMinder's health assistant. I can provide general medication information and health guidance. Please note that this information is for educational purposes and should not replace professional medical advice."
  ],

  medications: {
    antibiotics: {
      general: [
        "Antibiotics are medications used to treat bacterial infections. They work by killing bacteria or preventing them from reproducing.",
        "Antibiotics are not effective against viral infections like colds, flu, most sore throats, bronchitis, and many sinus and ear infections.",
        "It's important to complete the full course of antibiotics as prescribed, even if you feel better before finishing the medication.",
        "Common antibiotics include penicillins, cephalosporins, macrolides, fluoroquinolones, tetracyclines, and aminoglycosides."
      ],
      sideEffects: [
        "Common side effects of antibiotics include diarrhea, nausea, vomiting, and allergic reactions.",
        "Some antibiotics, particularly tetracyclines and fluoroquinolones, may increase sensitivity to sunlight, requiring protective measures when outdoors.",
        "Antibiotics may disrupt the natural balance of bacteria in your gut, potentially leading to secondary infections such as Clostridium difficile (C. diff).",
        "Certain antibiotics can interact with oral contraceptives, potentially reducing their effectiveness."
      ],
      precautions: [
        "Always inform your healthcare provider about any allergies to medications, especially previous reactions to antibiotics.",
        "Some antibiotics should be taken with food, while others should be taken on an empty stomach. Follow your healthcare provider's instructions.",
        "Alcohol should be avoided when taking certain antibiotics, such as metronidazole (Flagyl) and tinidazole (Tindamax), as it can cause severe nausea, vomiting, and headaches."
      ]
    },

    painRelievers: {
      nsaids: [
        "NSAIDs (Nonsteroidal Anti-Inflammatory Drugs) like ibuprofen (Advil, Motrin), naproxen (Aleve), and aspirin reduce inflammation, pain, and fever.",
        "NSAIDs work by blocking certain enzymes (COX-1 and COX-2) that produce prostaglandins, which are responsible for inflammation and pain.",
        "Long-term use of NSAIDs can increase the risk of stomach ulcers, kidney problems, and cardiovascular events such as heart attack and stroke.",
        "Taking NSAIDs with food can help reduce stomach irritation. Consider using the lowest effective dose for the shortest duration necessary."
      ],
      acetaminophen: [
        "Acetaminophen (Tylenol) reduces pain and fever but does not reduce inflammation.",
        "Acetaminophen is generally considered safer for the stomach than NSAIDs, making it a better option for people with ulcers or acid reflux.",
        "Overdosing on acetaminophen can cause severe liver damage. Never exceed the recommended daily dose (typically 4,000 mg per day for adults).",
        "Be cautious when taking multiple medications, as many combination cold and flu products also contain acetaminophen."
      ],
      opioids: [
        "Opioids are powerful pain relievers prescribed for severe pain that cannot be managed with other medications.",
        "Common opioids include morphine, oxycodone (OxyContin), hydrocodone (Vicodin), and codeine.",
        "Opioids carry risks of dependence, addiction, and respiratory depression (slowed breathing), particularly with higher doses or longer use.",
        "Never adjust your opioid dosage without consulting your healthcare provider, and discuss a plan for gradually tapering when it's time to stop taking them."
      ]
    },

    antihypertensives: {
      general: [
        "Antihypertensives are medications used to treat high blood pressure (hypertension).",
        "There are several classes of antihypertensives, including diuretics, ACE inhibitors, ARBs, calcium channel blockers, and beta-blockers.",
        "Many patients require multiple medications from different classes to adequately control blood pressure.",
        "Lifestyle modifications such as reducing sodium intake, regular exercise, maintaining a healthy weight, and limiting alcohol are important alongside medication therapy."
      ],
      sideEffects: [
        "Diuretics may cause increased urination, electrolyte imbalances, and sometimes gout.",
        "ACE inhibitors may cause a dry cough, while ARBs generally have fewer side effects.",
        "Calcium channel blockers may cause constipation, headaches, or ankle swelling.",
        "Beta-blockers may cause fatigue, cold hands and feet, or sleep disturbances."
      ],
      precautions: [
        "Blood pressure medications should be taken at the same time each day to maintain consistent levels in your system.",
        "Do not stop taking antihypertensive medications without consulting your healthcare provider, even if your blood pressure readings normalize.",
        "Some antihypertensives interact with grapefruit juice, which can increase the concentration of the medication in your bloodstream."
      ]
    },
    
    diabetes: {
      insulin: [
        "Insulin is a hormone that helps regulate blood sugar levels and is used to treat diabetes.",
        "Different types of insulin (rapid-acting, short-acting, intermediate-acting, and long-acting) are used to mimic the body's natural insulin production.",
        "Insulin must be injected under the skin using a syringe, insulin pen, or insulin pump, as it would be broken down in the digestive system if taken orally.",
        "Proper storage of insulin is crucial: unopened vials should be refrigerated, while in-use vials can typically be kept at room temperature for up to 28 days (check specific product information)."
      ],
      oralMedications: [
        "Metformin is typically the first-line medication for type 2 diabetes and works by reducing glucose production in the liver and improving insulin sensitivity.",
        "Sulfonylureas stimulate the pancreas to produce more insulin and may cause hypoglycemia (low blood sugar) if meals are skipped.",
        "SGLT2 inhibitors work by helping the kidneys remove glucose from the bloodstream and excrete it in urine.",
        "DPP-4 inhibitors help increase insulin production when blood sugar levels are high and reduce glucose production from the liver."
      ],
      monitoring: [
        "Regular blood glucose monitoring is essential for managing diabetes and adjusting medication doses appropriately.",
        "HbA1c tests measure average blood sugar levels over the past 2-3 months and are typically performed every 3-6 months.",
        "Hypoglycemia (blood sugar below 70 mg/dL) can cause shakiness, sweating, confusion, and if severe, loss of consciousness. Always carry fast-acting carbohydrates like glucose tablets.",
        "Hyperglycemia (high blood sugar) can cause increased thirst, frequent urination, fatigue, and blurred vision, and requires prompt attention."
      ]
    },
    
    general: [
      "Take medications exactly as prescribed by your healthcare provider, including timing, dosage, and duration.",
      "Do not abruptly stop taking prescription medications, especially those for chronic conditions, without consulting your healthcare provider.",
      "Store medications according to instructions, typically in a cool, dry place away from direct sunlight and out of reach of children.",
      "Properly dispose of expired or unused medications through drug take-back programs or following FDA guidelines for safe disposal."
    ],
    
    sideEffects: [
      "Common medication side effects may include nausea, headache, dizziness, fatigue, or digestive issues.",
      "Serious side effects requiring immediate medical attention include difficulty breathing, severe rash or hives, swelling of the face/lips/tongue, or severe dizziness.",
      "Some side effects may decrease over time as your body adjusts to the medication.",
      "Not everyone experiences side effects, and the benefits of the medication often outweigh the risks of potential side effects."
    ],
    
    interactions: [
      "Drug interactions can occur between prescription medications, over-the-counter drugs, dietary supplements, and certain foods or beverages.",
      "Always inform all healthcare providers about all medications and supplements you're taking to prevent potential interactions.",
      "Some common interaction concerns include warfarin with vitamin K-rich foods, certain antibiotics with dairy products, and MAO inhibitors with foods containing tyramine.",
      "Alcohol can interact with many medications, potentially increasing sedation with CNS depressants or causing liver damage when combined with acetaminophen."
    ],
    
    adherence: [
      "Set alarms or use pill organizers to help remember medication schedules.",
      "Link taking medications to daily routines, such as brushing teeth or eating meals.",
      "Mobile apps like MediMinder can provide reminders and help track medication adherence.",
      "If cost is a barrier to medication adherence, discuss with your healthcare provider about generic alternatives or patient assistance programs."
    ]
  },
  
  healthAdvice: {
    nutrition: [
      "A balanced diet rich in fruits, vegetables, whole grains, lean proteins, and healthy fats supports overall health and medication effectiveness.",
      "The Mediterranean diet, which emphasizes plant foods, olive oil, and fish while limiting red meat, has been shown to reduce the risk of cardiovascular disease and other chronic conditions.",
      "Adequate hydration (typically 8-10 cups of fluid daily for most adults) is important for medication absorption and overall health.",
      "Certain nutrients can interact with medications: calcium with tetracycline antibiotics, vitamin K with warfarin, or high-fiber foods with various medications."
    ],
    
    exercise: [
      "Regular physical activity (aim for at least 150 minutes of moderate-intensity exercise weekly) can help manage many chronic conditions and improve medication effectiveness.",
      "Exercise can help lower blood pressure, improve insulin sensitivity, reduce inflammation, and enhance mood and sleep quality.",
      "Start slowly and gradually increase duration and intensity, especially if you have been sedentary or have chronic health conditions.",
      "Some medications may affect your exercise capacity or response; discuss with your healthcare provider about any precautions needed during physical activity."
    ],
    
    sleep: [
      "Aim for 7-9 hours of quality sleep per night to support overall health and recovery.",
      "Establish a regular sleep schedule and bedtime routine to improve sleep quality.",
      "Some medications may cause drowsiness and are best taken before bedtime, while others may interfere with sleep and should be taken earlier in the day.",
      "Discuss sleep disturbances with your healthcare provider, as they may be related to underlying health conditions or medication side effects."
    ],
    
    stressManagement: [
      "Chronic stress can exacerbate many health conditions and potentially affect how your body responds to medications.",
      "Regular stress management techniques such as deep breathing, meditation, yoga, or tai chi can help reduce stress hormones and inflammation.",
      "Physical activity is an effective stress reducer and can improve mood through the release of endorphins.",
      "Consider seeking support through therapy, support groups, or speaking with your healthcare provider if stress becomes overwhelming."
    ]
  },
  
  preventiveCare: [
    "Regular health screenings and check-ups can detect health problems early when they're easier to treat.",
    "Adult immunizations, including annual flu vaccines, are important preventive measures even when taking regular medications.",
    "Maintain good oral health with regular dental check-ups, as oral health is connected to overall health, particularly cardiovascular health.",
    "Sun protection (SPF 30+ sunscreen, protective clothing, seeking shade) is important, especially if taking medications that increase sun sensitivity."
  ],
  
  disclaimer: [
    "This information is provided for educational purposes only and is not a substitute for professional medical advice, diagnosis, or treatment.",
    "Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition or medication.",
    "Never disregard professional medical advice or delay seeking it because of something you have read or heard from this assistant.",
    "In case of emergency, contact your local emergency services or go to the nearest emergency room immediately."
  ],
  
  fallback: [
    "I'm not able to provide specific medical advice about your individual situation. Please consult with your healthcare provider for personalized recommendations.",
    "That question requires more specific medical knowledge than I can provide. Please discuss this with your healthcare professional for accurate information.",
    "I don't have enough information to answer that question safely. Your healthcare provider would be the best person to address this concern.",
    "This seems to require personalized medical advice that should come from a licensed healthcare professional who knows your complete medical history."
  ]
};

export const ChatInterface: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: medicalKnowledgeBase.greetings[0] + " " + medicalKnowledgeBase.disclaimer[0],
      content: "Hi there! I'm your MediMinder assistant. How can I help you with your medications today?",
      sender: 'bot',
      timestamp: new Date(),
    },
  ]);
  
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Function to generate relevant responses based on user query
  const generateResponse = (query: string): string => {
    const lowerQuery = query.toLowerCase();
    let response = "";
    
    // Check if query is asking for a disclaimer or warning
    if (lowerQuery.includes('disclaimer') || lowerQuery.includes('warning') || lowerQuery.includes('notice')) {
      return medicalKnowledgeBase.disclaimer.join(' ');
    }
    
    // Check for medication-specific questions
    if (lowerQuery.includes('antibiotic') || lowerQuery.includes('penicillin') || lowerQuery.includes('amoxicillin')) {
      if (lowerQuery.includes('side effect') || lowerQuery.includes('reaction')) {
        response = medicalKnowledgeBase.medications.antibiotics.sideEffects[Math.floor(Math.random() * medicalKnowledgeBase.medications.antibiotics.sideEffects.length)];
      } else {
        response = medicalKnowledgeBase.medications.antibiotics.general[Math.floor(Math.random() * medicalKnowledgeBase.medications.antibiotics.general.length)];
      }
    } 
    // Pain medication questions
    else if (lowerQuery.includes('pain') || lowerQuery.includes('ibuprofen') || lowerQuery.includes('tylenol') || 
             lowerQuery.includes('advil') || lowerQuery.includes('aspirin') || lowerQuery.includes('acetaminophen')) {
      if (lowerQuery.includes('acetaminophen') || lowerQuery.includes('tylenol')) {
        response = medicalKnowledgeBase.medications.painRelievers.acetaminophen[Math.floor(Math.random() * medicalKnowledgeBase.medications.painRelievers.acetaminophen.length)];
      } else if (lowerQuery.includes('opioid') || lowerQuery.includes('narcotic') || lowerQuery.includes('morphine') || 
                lowerQuery.includes('oxycodone') || lowerQuery.includes('vicodin')) {
        response = medicalKnowledgeBase.medications.painRelievers.opioids[Math.floor(Math.random() * medicalKnowledgeBase.medications.painRelievers.opioids.length)];
      } else {
        response = medicalKnowledgeBase.medications.painRelievers.nsaids[Math.floor(Math.random() * medicalKnowledgeBase.medications.painRelievers.nsaids.length)];
      }
    }
    // Blood pressure medication questions
    else if (lowerQuery.includes('blood pressure') || lowerQuery.includes('hypertension') || 
             lowerQuery.includes('ace inhibitor') || lowerQuery.includes('beta blocker')) {
      if (lowerQuery.includes('side effect')) {
        response = medicalKnowledgeBase.medications.antihypertensives.sideEffects[Math.floor(Math.random() * medicalKnowledgeBase.medications.antihypertensives.sideEffects.length)];
      } else {
        response = medicalKnowledgeBase.medications.antihypertensives.general[Math.floor(Math.random() * medicalKnowledgeBase.medications.antihypertensives.general.length)];
      }
    }
    // Diabetes medication questions
    else if (lowerQuery.includes('diabetes') || lowerQuery.includes('insulin') || lowerQuery.includes('metformin') || 
             lowerQuery.includes('blood sugar') || lowerQuery.includes('glucose')) {
      if (lowerQuery.includes('insulin')) {
        response = medicalKnowledgeBase.medications.diabetes.insulin[Math.floor(Math.random() * medicalKnowledgeBase.medications.diabetes.insulin.length)];
      } else if (lowerQuery.includes('monitor') || lowerQuery.includes('test') || lowerQuery.includes('check')) {
        response = medicalKnowledgeBase.medications.diabetes.monitoring[Math.floor(Math.random() * medicalKnowledgeBase.medications.diabetes.monitoring.length)];
      } else {
        response = medicalKnowledgeBase.medications.diabetes.oralMedications[Math.floor(Math.random() * medicalKnowledgeBase.medications.diabetes.oralMedications.length)];
      }
    }
    // General medication questions
    else if (lowerQuery.includes('side effect') || lowerQuery.includes('reaction')) {
      response = medicalKnowledgeBase.medications.sideEffects[Math.floor(Math.random() * medicalKnowledgeBase.medications.sideEffects.length)];
    }
    else if (lowerQuery.includes('interact') || lowerQuery.includes('mix') || lowerQuery.includes('together') || 
             lowerQuery.includes('combination') || lowerQuery.includes('with other')) {
      response = medicalKnowledgeBase.medications.interactions[Math.floor(Math.random() * medicalKnowledgeBase.medications.interactions.length)];
    }
    else if (lowerQuery.includes('forget') || lowerQuery.includes('miss') || lowerQuery.includes('skip') || 
             lowerQuery.includes('reminder') || lowerQuery.includes('remember')) {
      response = medicalKnowledgeBase.medications.adherence[Math.floor(Math.random() * medicalKnowledgeBase.medications.adherence.length)];
    }
    else if (lowerQuery.includes('take') || lowerQuery.includes('medication') || lowerQuery.includes('pill') || 
             lowerQuery.includes('drug') || lowerQuery.includes('dose') || lowerQuery.includes('prescription')) {
      response = medicalKnowledgeBase.medications.general[Math.floor(Math.random() * medicalKnowledgeBase.medications.general.length)];
    }
    
    // Health advice questions
    else if (lowerQuery.includes('nutrition') || lowerQuery.includes('diet') || lowerQuery.includes('food') || 
             lowerQuery.includes('eat') || lowerQuery.includes('meal')) {
      response = medicalKnowledgeBase.healthAdvice.nutrition[Math.floor(Math.random() * medicalKnowledgeBase.healthAdvice.nutrition.length)];
    }
    else if (lowerQuery.includes('exercise') || lowerQuery.includes('workout') || lowerQuery.includes('activity') || 
             lowerQuery.includes('fitness') || lowerQuery.includes('move')) {
      response = medicalKnowledgeBase.healthAdvice.exercise[Math.floor(Math.random() * medicalKnowledgeBase.healthAdvice.exercise.length)];
    }
    else if (lowerQuery.includes('sleep') || lowerQuery.includes('rest') || lowerQuery.includes('insomnia') || 
             lowerQuery.includes('tired') || lowerQuery.includes('fatigue')) {
      response = medicalKnowledgeBase.healthAdvice.sleep[Math.floor(Math.random() * medicalKnowledgeBase.healthAdvice.sleep.length)];
    }
    else if (lowerQuery.includes('stress') || lowerQuery.includes('anxiety') || lowerQuery.includes('worried') || 
             lowerQuery.includes('tension') || lowerQuery.includes('relax')) {
      response = medicalKnowledgeBase.healthAdvice.stressManagement[Math.floor(Math.random() * medicalKnowledgeBase.healthAdvice.stressManagement.length)];
    }
    else if (lowerQuery.includes('health') || lowerQuery.includes('better') || lowerQuery.includes('improve') || 
             lowerQuery.includes('prevent') || lowerQuery.includes('wellness')) {
      response = medicalKnowledgeBase.preventiveCare[Math.floor(Math.random() * medicalKnowledgeBase.preventiveCare.length)];
    }
    
    // Check for greetings
    else if (lowerQuery.includes('hello') || lowerQuery.includes('hi') || lowerQuery.includes('hey') || 
             lowerQuery.includes('greetings') || lowerQuery === '') {
      response = medicalKnowledgeBase.greetings[Math.floor(Math.random() * medicalKnowledgeBase.greetings.length)];
    }
    
    // Fallback response
    else {
      response = medicalKnowledgeBase.fallback[Math.floor(Math.random() * medicalKnowledgeBase.fallback.length)];
    }
    
    // Add a reminder disclaimer for medical advice occasionally
    if (Math.random() < 0.3) {  // 30% chance to add a disclaimer
      response += " " + medicalKnowledgeBase.disclaimer[Math.floor(Math.random() * medicalKnowledgeBase.disclaimer.length)];
    }
    
    return response;
  };

  const handleSendMessage = async () => {
    if (!input.trim()) return;
    
    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      sender: 'user',
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);
    
    // Simulate thinking time (more realistic)
    setTimeout(() => {
      const response = generateResponse(userMessage.content);
      
      const botMessage: Message = {
        id: Date.now().toString(),
        content: response,
    // Simulated AI response - would connect to a real AI service in production
    setTimeout(() => {
      const botResponses = [
        "I understand you're asking about medication. Could you provide more details?",
        "It's important to take your medications as prescribed by your doctor.",
        "Remember to store your medications in a cool, dry place away from direct sunlight.",
        "If you experience any side effects, please consult your healthcare provider immediately.",
        "Make sure to take this medication with food to avoid stomach upset.",
        "I'd recommend setting up regular reminders for your medications to ensure you don't miss any doses."
      ];
      
      const randomResponse = botResponses[Math.floor(Math.random() * botResponses.length)];
      
      const botMessage: Message = {
        id: Date.now().toString(),
        content: randomResponse,
        sender: 'bot',
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const clearChat = () => {
    setMessages([
      {
        id: Date.now().toString(),
        content: medicalKnowledgeBase.greetings[Math.floor(Math.random() * medicalKnowledgeBase.greetings.length)],
        sender: 'bot',
        timestamp: new Date(),
      }
    ]);
    toast({
      title: "Chat history cleared",
      description: "Your conversation has been reset.",
    });
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] glass-card rounded-xl overflow-hidden">
      <div className="bg-secondary/50 backdrop-blur-sm p-4 border-b border-border flex items-center justify-between">
        <div className="flex items-center">
          <Avatar className="h-8 w-8 mr-2 bg-primary/20">
            <AvatarFallback className="text-primary">AI</AvatarFallback>
          </Avatar>
          <div>
            <h2 className="text-sm font-medium">MediMinder Assistant</h2>
            <p className="text-xs text-muted-foreground">Medication information & health advice</p>
          </div>
        </div>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={clearChat} 
          title="Clear chat history"
        >
          <RefreshCw className="h-4 w-4" />
        </Button>
            <p className="text-xs text-muted-foreground">Ask about medications, side effects, schedules</p>
          </div>
        </div>
      </div>
      
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          <AnimatePresence>
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className={`flex ${
                  message.sender === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                <div className="flex max-w-[80%]">
                  {message.sender === 'bot' && (
                    <Avatar className="h-8 w-8 mr-2 mt-0.5 flex-shrink-0">
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        <Bot className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                  )}
                  
                  <div
                    className={`rounded-xl p-3 ${
                      message.sender === 'user'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-secondary text-secondary-foreground'
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                    <p className="text-sm">{message.content}</p>
                    <span className="text-xs opacity-70 mt-1 block">
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  
                  {message.sender === 'user' && (
                    <Avatar className="h-8 w-8 ml-2 mt-0.5 flex-shrink-0">
                      <AvatarFallback className="bg-accent text-accent-foreground">
                        <User className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                  )}
                </div>
              </motion.div>
            ))}
            
            {isTyping && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex justify-start"
              >
                <div className="flex">
                  <Avatar className="h-8 w-8 mr-2 mt-0.5">
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      <Bot className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="rounded-xl p-3 bg-secondary flex items-center space-x-1">
                    <div className="h-2 w-2 rounded-full bg-primary/60 animate-pulse" />
                    <div className="h-2 w-2 rounded-full bg-primary/60 animate-pulse delay-150" />
                    <div className="h-2 w-2 rounded-full bg-primary/60 animate-pulse delay-300" />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>
      
      <div className="p-4 border-t border-border">
        <div className="flex space-x-2">
        <div className="flex">
          <Input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about medications, side effects, or health advice..."
            className="focus-visible:ring-0 focus-visible:ring-offset-0"
          />
          <Button 
            onClick={handleSendMessage} 
            disabled={!input.trim() || isTyping}
            className="shrink-0"
          >
            <Send className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Send</span>
          </Button>
        </div>
        <p className="text-xs text-muted-foreground mt-2 italic">
          For medical emergencies, please call emergency services or visit the nearest emergency room. This assistant provides general medical information for educational purposes only.
        </p>
            placeholder="Type your message..."
            className="rounded-r-none focus-visible:ring-0 focus-visible:ring-offset-0"
          />
          <Button 
            onClick={handleSendMessage} 
            className="rounded-l-none"
            disabled={!input.trim() || isTyping}
          >
            <Send className="h-4 w-4" />
            <span className="sr-only">Send</span>
          </Button>
        </div>
      </div>
    </div>
  );
};
