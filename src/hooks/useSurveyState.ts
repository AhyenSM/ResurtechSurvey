import { useState, useCallback, useEffect } from 'react';

export type SurveyAnswers = {
  primary_role?: string;
  familiarity_3d_printing?: number;
  is_active_cad_user?: boolean;
  
  // Branch A
  cad_tools?: string[];
  avg_design_time?: string;
  uses_ai_tools?: string;
  ai_tools_details?: string;
  main_pain_points?: string;
  
  // Feature Evaluations
  answered_optional_features?: boolean;
  feat_prompt_to_stl_score?: number;
  feat_prompt_to_stl_solves?: string;
  feat_prompt_to_stl_notes?: string;
  
  feat_localized_edit_score?: number;
  feat_localized_edit_solves?: string;
  feat_localized_edit_notes?: string;
  
  feat_file_converter_score?: number;
  feat_file_converter_solves?: string;
  feat_file_converter_notes?: string;
  
  feat_material_calc_score?: number;
  feat_material_calc_solves?: string;
  feat_material_calc_notes?: string;
  
  feat_multilingual_score?: number;
  feat_multilingual_solves?: string;
  feat_multilingual_notes?: string;
  
  additional_wished_features?: string;
  
  // Lead / Giveaway Contact
  full_name?: string;
  email?: string;
  opt_in_beta?: boolean;
};

export function useSurveyState() {
  const [currentScreen, setCurrentScreenState] = useState<number>(0);
  const [answers, setAnswers] = useState<SurveyAnswers>({ opt_in_beta: true });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash.startsWith('#step-')) {
        const step = parseInt(hash.replace('#step-', ''), 10);
        if (!isNaN(step)) {
          setCurrentScreenState(step);
          return;
        }
      }
      setCurrentScreenState(0);
    };
    
    window.addEventListener('hashchange', handleHashChange);
    
    if (!window.location.hash) {
      window.history.replaceState(null, '', '#step-0');
    } else {
      handleHashChange();
    }
    
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const setCurrentScreen = useCallback((target: number | ((prev: number) => number)) => {
    setCurrentScreenState((prev) => {
      const nextScreen = typeof target === 'function' ? target(prev) : target;
      if (nextScreen !== prev) {
        window.location.hash = `#step-${nextScreen}`;
      }
      return nextScreen;
    });
  }, []);

  const updateAnswers = useCallback((update: Partial<SurveyAnswers>) => {
    setAnswers((prev) => ({ ...prev, ...update }));
  }, []);

  const nextScreen = useCallback((targetScreen?: number) => {
    setCurrentScreen((prev) => targetScreen !== undefined ? targetScreen : prev + 1);
  }, []);

  const prevScreen = useCallback((targetScreen?: number) => {
    // If we have history state, we should ideally go back using window.history.back()
    // However, since prevScreen is currently implemented as jumping to prev - 1 or a specific screen,
    // we can just use window.history.back() if targetScreen is undefined.
    if (targetScreen !== undefined) {
      setCurrentScreen(targetScreen);
    } else {
      window.history.back();
    }
  }, [setCurrentScreen]);

  // Keyboard navigation logic will be attached in the specific components, 
  // but we provide a centralized way to handle generic enter.
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Allow default behavior if user is typing in an input/textarea
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') {
        return;
      }
      
      if (e.key === 'Tab' && e.shiftKey) {
        e.preventDefault();
        prevScreen();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [prevScreen]);

  return {
    currentScreen,
    answers,
    updateAnswers,
    nextScreen,
    prevScreen,
    isSubmitting,
    setIsSubmitting,
    error,
    setError
  };
}
