'use client';

import React, { useEffect, useRef } from 'react';
import { useSurveyState, SurveyAnswers } from '@/hooks/useSurveyState';
import { ProgressBar } from './ProgressBar';
import { QuestionCard } from './QuestionCard';
import { KeycapHint } from './KeycapHint';
import { supabase } from '@/lib/supabaseClient';
import { ChevronRight, Copy, Check } from 'lucide-react';

const roles = [
  'Mechanical / Hardware / Robotics Engineer',
  'Industrial / Product Designer',
  '3D Artist / Modeler / Animator',
  'Maker / 3D Printing Enthusiast / Hobbyist',
  'Architecture / Spatial Designer',
  'STEM Student / Academic Researcher',
  'Software / Tech Developer',
  'Other'
];

const cadTools = [
  'Autodesk Fusion 360',
  'Blender',
  'SolidWorks',
  'Onshape',
  'Autodesk Maya',
  'Rhino / Grasshopper',
  'Tinkercad',
  'PTC Creo / Autodesk Inventor',
  'Code-CAD (OpenSCAD, CadQuery, etc.)',
  'Other'
];

const durations = [
  'Under 1 hour',
  '1 – 3 hours',
  '4 – 8 hours',
  '1 – 2 days (8 – 16 hours)',
  'More than 2 days (24+ hours)'
];

const aiUsages = [
  'Yes, regularly',
  'Occasionally / Testing them out',
  'No, but interested',
  'No, haven\'t found any worth using'
];

const featureConcepts = [
  {
    id: 1,
    title: 'Feature 1: Prompt-to-Printable STL',
    desc: 'Natural language input that instantly generates watertight, slicable, engineering-grade 3D meshes/CAD files in minutes, ready for slicing.',
    scoreKey: 'feat_prompt_to_stl_score',
    solvesKey: 'feat_prompt_to_stl_solves',
    notesKey: 'feat_prompt_to_stl_notes'
  },
  {
    id: 2,
    title: 'Feature 2: Localized Prompt Editing',
    desc: 'Selecting or highlighting an isolated sub-section of an existing 3D model and modifying its geometry or dimensions via text commands without re-generating the rest of the object.',
    scoreKey: 'feat_localized_edit_score',
    solvesKey: 'feat_localized_edit_solves',
    notesKey: 'feat_localized_edit_notes'
  },
  {
    id: 3,
    title: 'Feature 3: Universal 3D File Converter & Scaler',
    desc: 'An automated tool that cleans, auto-scales, and converts proprietary or complex mesh/CAD files between printer-ready formats (STEP, STL, OBJ, 3MF) with automated mesh healing.',
    scoreKey: 'feat_file_converter_score',
    solvesKey: 'feat_file_converter_solves',
    notesKey: 'feat_file_converter_notes'
  },
  {
    id: 4,
    title: 'Feature 4: Conscience & Material Calculator',
    desc: 'A pre-print predictive engine that calculates exact filament/resin consumption, material cost, print duration, and scrap waste before sending the file to a slicer.',
    scoreKey: 'feat_material_calc_score',
    solvesKey: 'feat_material_calc_solves',
    notesKey: 'feat_material_calc_notes'
  },
  {
    id: 5,
    title: 'Feature 5: Multilingual Prompting',
    desc: 'Full natural language support allowing users to describe, modify, and iterate on 3D geometry in their native language (e.g., Arabic, French, German, Spanish, Hindi) without losing technical precision.',
    scoreKey: 'feat_multilingual_score',
    solvesKey: 'feat_multilingual_solves',
    notesKey: 'feat_multilingual_notes'
  }
];

export function SurveyContainer() {
  const { currentScreen, answers, updateAnswers, nextScreen, prevScreen, isSubmitting, setIsSubmitting, error, setError } = useSurveyState();
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [currentScreen]);

  const submitToSupabase = async (payload: any) => {
    setIsSubmitting(true);
    setError(null);
    try {
      if (process.env.NEXT_PUBLIC_SUPABASE_URL === 'https://placeholder.supabase.co' || !process.env.NEXT_PUBLIC_SUPABASE_URL) {
        console.log('Mock submission payload:', payload);
        await new Promise(resolve => setTimeout(resolve, 1000));
        nextScreen(16);
        return;
      }

      const { error: sbError } = await supabase.from('survey_responses').insert([payload]);
      if (sbError) throw sbError;
      nextScreen(16);
    } catch (err: any) {
      setError(err.message || 'An error occurred during submission.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGlobalEnter = (e: React.KeyboardEvent, action: () => void) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      action();
    }
  };

  const toggleCadTool = (tool: string) => {
    const currentTools = answers.cad_tools || [];
    if (currentTools.includes(tool)) {
      updateAnswers({ cad_tools: currentTools.filter(t => t !== tool) });
    } else {
      updateAnswers({ cad_tools: [...currentTools, tool] });
    }
  };

  // Maps currentScreen to progress out of ~15 real steps
  // Branch A steps: 100-111, Branch B steps: 201
  const calculateProgress = () => {
    if (currentScreen === 0) return 1;
    if (currentScreen === 16) return 16;
    if (currentScreen === 15) return 15;
    if (currentScreen === 201) return 4;
    
    if (currentScreen >= 1 && currentScreen <= 3) return currentScreen;
    if (currentScreen >= 100 && currentScreen <= 105) return currentScreen - 100 + 4; // 4 to 9
    if (currentScreen >= 106 && currentScreen <= 111) return currentScreen - 106 + 9; // 9 to 14
    return 1;
  };

  const renderScreen = () => {
    if (currentScreen >= 106 && currentScreen <= 110) {
      const featIdx = currentScreen - 106;
      const feat = featureConcepts[featIdx];
      const currentScore = (answers as any)[feat.scoreKey];
      const currentSolves = (answers as any)[feat.solvesKey];
      const currentNotes = (answers as any)[feat.notesKey] || '';

      return (
        <QuestionCard id={currentScreen}>
          <h2>{feat.title}</h2>
          <p style={{ color: 'var(--void)', marginBottom: '1.5rem', fontStyle: 'italic' }}>{feat.desc}</p>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div>
              <p style={{ color: 'var(--ink-dim)' }}>How valuable would this be to your workflow? (1 = Not at all, 5 = Essential)</p>
              <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
                {[1, 2, 3, 4, 5].map((score) => (
                  <button
                    key={score}
                    className="glass-panel"
                    style={{ 
                      flex: 1, padding: '1.25rem 0', cursor: 'pointer', fontSize: '1.1rem',
                      background: currentScore === score ? 'var(--emerald-2)' : 'rgba(255, 255, 255, 0.85)',
                      border: currentScore === score ? '1px solid var(--neon)' : '1px solid rgba(6, 54, 42, 0.08)',
                      color: currentScore === score ? '#ffffff' : 'var(--void)'
                    }}
                    onClick={() => updateAnswers({ [feat.scoreKey]: score } as any)}
                  >
                    {score}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p style={{ color: 'var(--ink-dim)' }}>Would this solve a current bottleneck for you?</p>
              <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
                {['Yes', 'Somewhat', 'No'].map(opt => (
                  <button
                    key={opt}
                    className="glass-panel"
                    style={{ 
                      flex: 1, padding: '1.25rem 0', cursor: 'pointer', fontSize: '1.1rem',
                      background: currentSolves === opt ? 'var(--emerald-2)' : 'rgba(255, 255, 255, 0.85)',
                      border: currentSolves === opt ? '1px solid var(--neon)' : '1px solid rgba(6, 54, 42, 0.08)',
                      color: currentSolves === opt ? '#ffffff' : 'var(--void)'
                    }}
                    onClick={() => updateAnswers({ [feat.solvesKey]: opt } as any)}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p style={{ color: 'var(--ink-dim)' }}>Optional Notes / Thoughts:</p>
              <input
                className="glass-panel"
                type="text"
                style={{ width: '100%', padding: '1rem', color: 'var(--void)', outline: 'none', marginTop: '0.5rem' }}
                value={currentNotes}
                onChange={(e) => updateAnswers({ [feat.notesKey]: e.target.value } as any)}
                onKeyDown={(e) => handleGlobalEnter(e, () => nextScreen(currentScreen + 1))}
              />
            </div>
          </div>
          
          <button
              className="glass-panel"
              style={{ background: 'var(--emerald)', padding: '0.75rem 1.5rem', color: 'var(--neon)', cursor: 'pointer', alignSelf: 'flex-end', marginTop: '1rem' }}
              onClick={() => nextScreen(currentScreen + 1)}
            >
              Continue <KeycapHint>Enter ↵</KeycapHint>
          </button>
        </QuestionCard>
      );
    }

    switch (currentScreen) {
      case 0:
        return (
          <QuestionCard id={0} maxWidth="1100px">
            <div style={{ display: 'flex', alignItems: 'stretch', gap: '4rem', width: '100%' }}>
              {/* Image Column */}
              <div style={{ flex: '1', display: 'flex' }}>
                <img 
                  src="/survey-picture.jpg" 
                  alt="3D Prototyping" 
                  style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '24px', boxShadow: '0 12px 40px rgba(6, 54, 42, 0.2)' }} 
                />
              </div>
              
              {/* Content Column */}
              <div style={{ flex: '1', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'center', padding: '2rem 0' }}>
                <h1 style={{ fontSize: '3.5rem', marginBottom: '1.5rem', color: 'var(--emerald)', lineHeight: '1.2' }}>
                  Help Shape the Future of 3D Prototyping
                </h1>
                <p style={{ color: 'var(--void)', fontSize: '1.25rem', lineHeight: 1.6, marginBottom: '2.5rem' }}>
                  We are researching how creators, engineers, and designers bring 3D physical ideas to life—and where the biggest workflow bottlenecks still exist.
                </p>
                <div style={{ display: 'flex', gap: '1rem', marginBottom: '3rem', flexWrap: 'wrap' }}>
                  <span className="glass-panel" style={{ padding: '0.75rem 1.25rem', color: 'var(--void)', background: 'rgba(255, 255, 255, 0.9)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    ⏱ 3–5 Minutes
                  </span>
                  <span className="glass-panel" style={{ padding: '0.75rem 1.25rem', color: 'var(--void)', background: 'rgba(255, 255, 255, 0.9)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    🎁 Giveaway Entry Included
                  </span>
                </div>
                <button 
                  autoFocus
                  className="glass-panel"
                  style={{
                    background: 'var(--emerald)', color: 'var(--neon)', border: '1px solid var(--neon)',
                    padding: '1.25rem 2.5rem', fontSize: '1.25rem', cursor: 'pointer',
                    display: 'inline-flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600
                  }}
                  onClick={() => nextScreen(1)}
                  onKeyDown={(e) => handleGlobalEnter(e, () => nextScreen(1))}
                >
                  Start Survey <KeycapHint>Enter ↵</KeycapHint>
                </button>
              </div>
            </div>
          </QuestionCard>
        );

      case 1:
        return (
          <QuestionCard id={1}>
            <h2>Which of the following best describes your primary role or background?</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '1.5rem' }}>
              {roles.map((role, idx) => (
                <button
                  key={role}
                  className="glass-panel"
                  style={{
                    padding: '1.25rem', textAlign: 'left', cursor: 'pointer', fontSize: '1.1rem',
                    background: answers.primary_role === role ? 'var(--emerald-2)' : 'rgba(255, 255, 255, 0.85)',
                    border: answers.primary_role === role ? '1px solid var(--neon)' : '1px solid rgba(6, 54, 42, 0.08)',
                    color: answers.primary_role === role ? '#ffffff' : 'var(--void)'
                  }}
                  onClick={() => {
                    updateAnswers({ primary_role: role });
                    nextScreen(2);
                  }}
                >
                  <span style={{ display: 'inline-block', width: '24px', color: answers.primary_role === role ? 'rgba(255,255,255,0.7)' : 'var(--ink-dim)' }}>{idx + 1}</span>
                  {role}
                </button>
              ))}
            </div>
          </QuestionCard>
        );

      case 2: {
        const options = [
          { s: 1, label: 'Complete beginner / Never used a 3D printer' },
          { s: 2, label: 'Familiar with the concept, but rarely interact with it' },
          { s: 3, label: 'Intermediate (Have sliced or printed existing files like Thingiverse/Printables)' },
          { s: 4, label: 'Proficient (Regularly operate 3D printers and adjust print settings)' },
          { s: 5, label: 'Expert (Daily user, print tuning, advanced materials, or farm management)' }
        ];
        const selectedOpt = options.find(o => o.s === answers.familiarity_3d_printing);

        return (
          <QuestionCard id={2}>
            <h2>How familiar are you with 3D printing and digital fabrication?</h2>
            <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
              {options.map((opt) => (
                <button
                  key={opt.s}
                  className="glass-panel"
                  style={{
                    flex: 1, padding: '1.5rem 0', cursor: 'pointer', fontSize: '1.5rem', fontWeight: 'bold',
                    background: answers.familiarity_3d_printing === opt.s ? 'var(--emerald-2)' : 'rgba(255, 255, 255, 0.85)',
                    border: answers.familiarity_3d_printing === opt.s ? '1px solid var(--neon)' : '1px solid rgba(6, 54, 42, 0.08)',
                    color: answers.familiarity_3d_printing === opt.s ? '#ffffff' : 'var(--void)'
                  }}
                  onClick={() => {
                    updateAnswers({ familiarity_3d_printing: opt.s });
                  }}
                >
                  {opt.s}
                </button>
              ))}
            </div>

            {selectedOpt && (
              <div style={{ marginTop: '2rem', padding: '1.5rem', background: 'rgba(6, 54, 42, 0.05)', borderRadius: '12px', border: '1px solid rgba(6, 54, 42, 0.1)', textAlign: 'center' }}>
                <p style={{ fontSize: '1.25rem', color: 'var(--emerald)', fontWeight: 500 }}>
                  {selectedOpt.label}
                </p>
              </div>
            )}

            {selectedOpt && (
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
                <button
                  autoFocus
                  className="glass-panel"
                  style={{ background: 'var(--emerald)', padding: '0.75rem 1.5rem', color: 'var(--neon)', cursor: 'pointer' }}
                  onClick={() => nextScreen(3)}
                >
                  Continue <KeycapHint>Enter ↵</KeycapHint>
                </button>
              </div>
            )}
          </QuestionCard>
        );
      }

      case 3:
        return (
          <QuestionCard id={3}>
            <h2>Do you personally create or modify 3D digital models/CAD files?</h2>
            <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
              <button
                className="glass-panel"
                style={{ 
                  flex: 1, padding: '1.5rem', cursor: 'pointer', fontSize: '1.25rem',
                  background: answers.is_active_cad_user === true ? 'var(--emerald-2)' : 'rgba(255, 255, 255, 0.85)',
                  border: answers.is_active_cad_user === true ? '1px solid var(--neon)' : '1px solid rgba(6, 54, 42, 0.08)',
                  color: answers.is_active_cad_user === true ? '#ffffff' : 'var(--void)'
                }}
                onClick={() => {
                  updateAnswers({ is_active_cad_user: true });
                  nextScreen(100);
                }}
              >
                Yes (Active 3D Designer)
              </button>
              <button
                className="glass-panel"
                style={{ 
                  flex: 1, padding: '1.5rem', cursor: 'pointer', fontSize: '1.25rem',
                  background: answers.is_active_cad_user === false ? 'var(--emerald-2)' : 'rgba(255, 255, 255, 0.85)',
                  border: answers.is_active_cad_user === false ? '1px solid var(--neon)' : '1px solid rgba(6, 54, 42, 0.08)',
                  color: answers.is_active_cad_user === false ? '#ffffff' : 'var(--void)'
                }}
                onClick={() => {
                  updateAnswers({ is_active_cad_user: false });
                  nextScreen(201);
                }}
              >
                No (Not Currently)
              </button>
            </div>
          </QuestionCard>
        );

      // --- Branch A ---
      case 100:
        return (
          <QuestionCard id={100} maxWidth="900px">
            <h2>Which 3D modeling or CAD tools do you use most frequently?</h2>
            <p style={{ color: 'var(--ink-dim)' }}>Select all that apply.</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1rem', marginTop: '2rem' }}>
              {cadTools.map((tool) => {
                const isSelected = answers.cad_tools?.includes(tool);
                return (
                  <button
                    key={tool}
                    className="glass-panel"
                    style={{
                      padding: '1.25rem', textAlign: 'center', cursor: 'pointer', fontSize: '1.1rem',
                      background: isSelected ? 'var(--emerald-2)' : 'rgba(255, 255, 255, 0.85)',
                      border: isSelected ? '1px solid var(--neon)' : '1px solid rgba(6, 54, 42, 0.08)',
                      color: isSelected ? '#ffffff' : 'var(--void)'
                    }}
                    onClick={() => toggleCadTool(tool)}
                  >
                    {tool}
                  </button>
                )
              })}
            </div>
            <button
                className="glass-panel"
                style={{ background: 'var(--emerald)', padding: '0.75rem 1.5rem', color: 'var(--neon)', cursor: 'pointer', marginTop: '2rem', alignSelf: 'flex-end' }}
                onClick={() => nextScreen(101)}
              >
                Continue <KeycapHint>Enter ↵</KeycapHint>
            </button>
          </QuestionCard>
        );

      case 101:
        return (
          <QuestionCard id={101}>
            <h2>On average, how long does it take you to take a moderately complex part or model from initial concept to a finished 3D file ready for prototyping?</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '1.5rem' }}>
              {durations.map(dur => (
                <button
                  key={dur}
                  className="glass-panel"
                  style={{
                    padding: '1.25rem', textAlign: 'left', cursor: 'pointer', fontSize: '1.1rem',
                    background: answers.avg_design_time === dur ? 'var(--emerald-2)' : 'rgba(255, 255, 255, 0.85)',
                    border: answers.avg_design_time === dur ? '1px solid var(--neon)' : '1px solid rgba(6, 54, 42, 0.08)',
                    color: answers.avg_design_time === dur ? '#ffffff' : 'var(--void)'
                  }}
                  onClick={() => {
                    updateAnswers({ avg_design_time: dur });
                    nextScreen(102);
                  }}
                >
                  {dur}
                </button>
              ))}
            </div>
          </QuestionCard>
        );

      case 102:
        return (
          <QuestionCard id={102}>
            <h2>Do you currently use any AI tools in your 3D design or 3D printing workflow?</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1.5rem' }}>
              {aiUsages.map(opt => (
                <button
                  key={opt}
                  className="glass-panel"
                  style={{ 
                    padding: '1.25rem', textAlign: 'left', cursor: 'pointer', fontSize: '1.1rem',
                    background: answers.uses_ai_tools === opt ? 'var(--emerald-2)' : 'rgba(255, 255, 255, 0.85)',
                    border: answers.uses_ai_tools === opt ? '1px solid var(--neon)' : '1px solid rgba(6, 54, 42, 0.08)',
                    color: answers.uses_ai_tools === opt ? '#ffffff' : 'var(--void)' 
                  }}
                  onClick={() => {
                    updateAnswers({ uses_ai_tools: opt });
                    if (opt.includes('Yes') || opt.includes('Occasionally')) {
                      nextScreen(103);
                    } else {
                      nextScreen(104);
                    }
                  }}
                >
                  {opt}
                </button>
              ))}
            </div>
          </QuestionCard>
        );

      case 103:
        return (
          <QuestionCard id={103}>
            <h2>Which AI tools or platforms have you experimented with, and what specific features do you like about them?</h2>
            <textarea
              ref={inputRef as any}
              className="glass-panel"
              rows={5}
              style={{ width: '100%', padding: '1rem', color: 'var(--void)', outline: 'none', resize: 'none', marginTop: '1rem' }}
              value={answers.ai_tools_details || ''}
              onChange={(e) => updateAnswers({ ai_tools_details: e.target.value })}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && e.ctrlKey) {
                  nextScreen(104);
                }
              }}
            />
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
              <button
                className="glass-panel"
                style={{ background: 'var(--emerald)', padding: '0.75rem 1.5rem', color: 'var(--neon)', cursor: 'pointer' }}
                onClick={() => nextScreen(104)}
              >
                Continue <KeycapHint>Ctrl + Enter</KeycapHint>
              </button>
            </div>
          </QuestionCard>
        );

      case 104:
        return (
          <QuestionCard id={104}>
            <h2>What are your biggest pain points with existing 3D software, and what is one feature you crave that you wish an AI tool could solve?</h2>
            <textarea
              ref={inputRef as any}
              className="glass-panel"
              rows={5}
              style={{ width: '100%', padding: '1rem', color: 'var(--void)', outline: 'none', resize: 'none', marginTop: '1rem' }}
              placeholder="e.g., steep learning curve, repairing mesh errors, fixing non-manifold geometry..."
              value={answers.main_pain_points || ''}
              onChange={(e) => updateAnswers({ main_pain_points: e.target.value })}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && e.ctrlKey) {
                  nextScreen(105);
                }
              }}
            />
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
              <button
                className="glass-panel"
                style={{ background: 'var(--emerald)', padding: '0.75rem 1.5rem', color: 'var(--neon)', cursor: 'pointer' }}
                onClick={() => nextScreen(105)}
              >
                Continue <KeycapHint>Ctrl + Enter</KeycapHint>
              </button>
            </div>
          </QuestionCard>
        );

      case 105:
        return (
          <QuestionCard id={105}>
            <h2>You are almost done!</h2>
            <p style={{ color: 'var(--void)' }}>Choose your submission path:</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '2rem' }}>
              <button
                className="glass-panel"
                style={{ padding: '1.5rem', cursor: 'pointer', fontSize: '1.1rem', color: 'var(--void)', textAlign: 'left' }}
                onClick={() => {
                  updateAnswers({ answered_optional_features: false });
                  nextScreen(15);
                }}
              >
                <strong>Option 1: Quick Submit</strong><br/>
                Finish now and enter my details.
              </button>
              <button
                autoFocus
                className="glass-panel"
                style={{ padding: '1.5rem', cursor: 'pointer', fontSize: '1.1rem', background: 'var(--emerald)', border: '1px solid var(--neon)', color: 'var(--neon)', textAlign: 'left' }}
                onClick={() => {
                  updateAnswers({ answered_optional_features: true });
                  nextScreen(106);
                }}
              >
                <strong>Option 2: Giveaway Qualification</strong><br/>
                Answer 5 quick feature ratings to qualify for the giveaway.
              </button>
            </div>
          </QuestionCard>
        );

      case 111:
        return (
          <QuestionCard id={111}>
            <h2>What other capability or feature would genuinely make your daily design-to-prototype life easier?</h2>
            <textarea
              ref={inputRef as any}
              className="glass-panel"
              rows={5}
              style={{ width: '100%', padding: '1rem', color: 'var(--void)', outline: 'none', resize: 'none', marginTop: '1rem' }}
              value={answers.additional_wished_features || ''}
              onChange={(e) => updateAnswers({ additional_wished_features: e.target.value })}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && e.ctrlKey) {
                  nextScreen(15);
                }
              }}
            />
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
              <button
                className="glass-panel"
                style={{ background: 'var(--emerald)', padding: '0.75rem 1.5rem', color: 'var(--neon)', cursor: 'pointer' }}
                onClick={() => nextScreen(15)}
              >
                Continue <KeycapHint>Ctrl + Enter</KeycapHint>
              </button>
            </div>
          </QuestionCard>
        );

      // --- Branch B ---
      case 201:
        return (
          <QuestionCard id={201}>
            <h2>We are specifically studying hands-on CAD and 3D modeling bottlenecks.</h2>
            <p style={{ color: 'var(--void)', marginTop: '1rem' }}>Do you know a colleague, friend, or creator who regularly designs in CAD or 3D prints?</p>
            <p style={{ color: 'var(--ink-dim)', marginTop: '0.5rem' }}>Share this survey link with them:</p>
            <div 
              className="glass-panel" 
              style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', marginTop: '1rem' }}
            >
              <code style={{ color: 'var(--emerald)' }}>resurtech.co/survey</code>
              <button 
                onClick={() => navigator.clipboard.writeText('https://resurtech.co/survey')}
                style={{ background: 'none', border: 'none', color: 'var(--neon)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
              >
                <Copy size={16} /> Copy
              </button>
            </div>
            <button
                className="glass-panel"
                style={{ background: 'var(--emerald)', padding: '0.75rem 1.5rem', color: 'var(--neon)', cursor: 'pointer', marginTop: '2rem', alignSelf: 'flex-end' }}
                onClick={() => nextScreen(15)}
              >
                Continue to Giveaway <KeycapHint>Enter ↵</KeycapHint>
            </button>
          </QuestionCard>
        );

      // --- Common Final Submission ---
      case 15: {
        const isGiveawayEligible = answers.is_active_cad_user === false || answers.answered_optional_features === true;
        return (
          <QuestionCard id={15}>
            <h2>{isGiveawayEligible ? 'Final Submission & Giveaway Entry' : 'Final Submission'}</h2>
            <p style={{ color: 'var(--ink-dim)', marginBottom: '1rem' }}>
              {isGiveawayEligible 
                ? (answers.is_active_cad_user === false 
                    ? 'Leave your details below to be entered into our giveaway as a thank you for sharing:' 
                    : 'Leave your details below to finalize your entry and giveaway qualification.')
                : 'Leave your details below to finalize your submission.'}
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <input
                autoFocus
                className="glass-panel"
                type="text"
                placeholder="Full Name"
                style={{ padding: '1rem', color: 'var(--void)', outline: 'none' }}
                value={answers.full_name || ''}
                onChange={(e) => updateAnswers({ full_name: e.target.value })}
              />
              <input
                className="glass-panel"
                type="email"
                placeholder="Email Address"
                style={{ padding: '1rem', color: 'var(--void)', outline: 'none' }}
                value={answers.email || ''}
                onChange={(e) => updateAnswers({ email: e.target.value })}
              />
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--void)', cursor: 'pointer', marginTop: '1rem' }}>
                <input
                  type="checkbox"
                  checked={answers.opt_in_beta}
                  onChange={(e) => updateAnswers({ opt_in_beta: e.target.checked })}
                  style={{ accentColor: 'var(--neon)', width: '18px', height: '18px' }}
                />
                Keep me updated on beta testing and early access opportunities for tools like these.
              </label>
              
              {error && <p style={{ color: '#ff6b6b' }}>{error}</p>}

              <button
                className="glass-panel"
                style={{ 
                  background: 'var(--emerald)', color: 'var(--neon)', border: '1px solid var(--neon)',
                  padding: '1rem', marginTop: '2rem', cursor: isSubmitting ? 'not-allowed' : 'pointer', opacity: isSubmitting ? 0.7 : 1, fontWeight: 'bold'
                }}
                disabled={isSubmitting || !answers.email}
                onClick={() => submitToSupabase(answers)}
              >
                {isSubmitting ? 'Submitting...' : 'SUBMIT SURVEY'} <KeycapHint>Enter ↵</KeycapHint>
              </button>
            </div>
          </QuestionCard>
        );
      }

      case 16:
        return (
          <QuestionCard id={16}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
              <div style={{ 
                width: '64px', height: '64px', borderRadius: '50%', background: 'var(--emerald)', 
                display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '2rem',
                border: '1px solid var(--neon)', boxShadow: '0 0 24px rgba(57, 255, 20, 0.25)'
              }}>
                <Check color="var(--neon)" size={32} />
              </div>
              <h2>Thank you for your feedback!</h2>
              <p style={{ color: 'var(--void)', marginTop: '1rem' }}>Your responses help shape the future of digital fabrication.</p>
              <a href="https://resurtech.co" style={{ marginTop: '3rem', color: 'var(--ink-dim)', textDecoration: 'underline' }}>
                Return to Resurtech.co
              </a>
            </div>
          </QuestionCard>
        );
      
      default:
        return null;
    }
  };

  return (
    <div style={{ position: 'relative', width: '100%', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <ProgressBar current={calculateProgress()} total={15} />
      
      {renderScreen()}

      <div style={{ position: 'fixed', bottom: '2rem', left: '2rem', zIndex: 100 }}>
        {currentScreen > 0 && currentScreen !== 16 && (
          <button
            className="glass-panel"
            style={{ 
              padding: '0.75rem 1.25rem', 
              cursor: 'pointer', 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.5rem', 
              color: 'var(--void)',
              background: 'rgba(255, 255, 255, 0.85)',
              border: '1px solid rgba(6, 54, 42, 0.08)',
              fontWeight: 500,
              fontSize: '1rem'
            }}
            onClick={() => prevScreen()}
          >
            ← Back
          </button>
        )}
      </div>
    </div>
  );
}
