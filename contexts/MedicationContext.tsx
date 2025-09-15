import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import api from '../lib/api-services';
import { Medication, CreateMedicationRequest, UpdateMedicationRequest } from '../lib/api-types';

interface MedicationContextType {
  medications: Medication[];
  addMedication: (medication: CreateMedicationRequest) => Promise<void>;
  updateMedication: (id: number, updates: UpdateMedicationRequest) => Promise<void>;
  deleteMedication: (id: number) => Promise<void>;
  markAsTaken: (id: number) => Promise<void>;
  loadMedications: () => Promise<void>;
  isLoading: boolean;
}

const MedicationContext = createContext<MedicationContextType | undefined>(undefined);

interface MedicationProviderProps {
  children: ReactNode;
}

export const MedicationProvider: React.FC<MedicationProviderProps> = ({ children }) => {
  const [medications, setMedications] = useState<Medication[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // 서버에서 약 복용 정보 로드
  const loadMedications = async () => {
    setIsLoading(true);
    try {
      const serverMedications = await api.medication.getMedications();
      setMedications(serverMedications);
    } catch (error) {
      console.error('약 복용 정보 로드 실패:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // 약 복용 정보 추가
  const addMedication = async (medicationData: CreateMedicationRequest) => {
    try {
      await api.medication.createMedication(medicationData);
      await loadMedications(); // 서버에서 최신 데이터 다시 로드
    } catch (error) {
      console.error('약 복용 정보 추가 실패:', error);
      throw error;
    }
  };

  // 약 복용 정보 수정
  const updateMedication = async (id: number, updates: UpdateMedicationRequest) => {
    try {
      await api.medication.updateMedication(id, updates);
      await loadMedications(); // 서버에서 최신 데이터 다시 로드
    } catch (error) {
      console.error('약 복용 정보 수정 실패:', error);
      throw error;
    }
  };

  // 약 복용 정보 삭제
  const deleteMedication = async (id: number) => {
    try {
      await api.medication.deleteMedication(id);
      setMedications(prev => prev.filter(med => med.medicationId !== id));
    } catch (error) {
      console.error('약 복용 정보 삭제 실패:', error);
      throw error;
    }
  };

  // 약 복용 완료 처리
  const markAsTaken = async (id: number) => {
    try {
      await api.medication.markAsTaken(id);
      // 로컬 상태 업데이트
      setMedications(prev => 
        prev.map(med => 
          med.medicationId === id ? { ...med, taken: true } : med
        )
      );
    } catch (error) {
      console.error('약 복용 완료 처리 실패:', error);
      throw error;
    }
  };

  // 컴포넌트 마운트 시 서버에서 데이터 로드
  useEffect(() => {
    loadMedications();
  }, []);

  return (
    <MedicationContext.Provider value={{
      medications,
      addMedication,
      updateMedication,
      deleteMedication,
      markAsTaken,
      loadMedications,
      isLoading
    }}>
      {children}
    </MedicationContext.Provider>
  );
};

export const useMedication = () => {
  const context = useContext(MedicationContext);
  if (context === undefined) {
    throw new Error('useMedication must be used within a MedicationProvider');
  }
  return context;
};
