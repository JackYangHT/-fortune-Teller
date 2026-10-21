import React, { useState, useEffect } from 'react';
import { UserBirthData } from './types/destiny';
import { OnboardingForm } from './components/OnboardingForm';
import { ChatInterface } from './components/ChatInterface';

const STORAGE_KEY_BIRTH_DATA = 'jack_ai_destiny_birth_data';

export default function App() {
  const [birthData, setBirthData] = useState<UserBirthData | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // 1. Initial State Check on mount:
  // If LocalStorage has birth data, direct to ChatInterface; otherwise force OnboardingForm.
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_BIRTH_DATA);
      if (stored) {
        const parsed: UserBirthData = JSON.parse(stored);
        if (parsed.gender && parsed.birthDate && parsed.birthHour) {
          setBirthData(parsed);
        }
      }
    } catch (e) {
      console.error('Failed to read birth data from localStorage:', e);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Handle Onboarding Completion
  const handleOnboardingComplete = (data: UserBirthData) => {
    setBirthData(data);
    setIsEditing(false);
  };

  // Switch back to edit birth data
  const handleEditBirthData = () => {
    setIsEditing(true);
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-stone-950 flex items-center justify-center text-stone-400 text-sm">
        <div className="animate-pulse">正在載入 Jack 老師命理系統...</div>
      </div>
    );
  }

  // If no birth data exists or user explicitly wants to edit, show Onboarding Form
  if (!birthData || isEditing) {
    return (
      <OnboardingForm
        onComplete={handleOnboardingComplete}
        initialData={birthData}
      />
    );
  }

  // Otherwise, directly display the Chat Interface with "我的先天 GPS"
  return (
    <ChatInterface
      birthData={birthData}
      onEditBirthData={handleEditBirthData}
    />
  );
}
