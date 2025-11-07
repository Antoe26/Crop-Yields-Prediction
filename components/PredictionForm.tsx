
import React from 'react';
import { PredictionInput, CropType, SoilType } from '../types';

interface PredictionFormProps {
  formData: PredictionInput;
  onFormChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
  isLoading: boolean;
}

const FormField: React.FC<{ children: React.ReactNode; label: string; htmlFor: string }> = ({ children, label, htmlFor }) => (
  <div>
    <label htmlFor={htmlFor} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{label}</label>
    {children}
  </div>
);

const sharedInputClasses = "w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition";

export const PredictionForm: React.FC<PredictionFormProps> = ({ formData, onFormChange, onSubmit, isLoading }) => {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormField label="Crop Type" htmlFor="cropType">
          <select id="cropType" name="cropType" value={formData.cropType} onChange={onFormChange} className={sharedInputClasses}>
            {Object.values(CropType).map(crop => <option key={crop} value={crop}>{crop}</option>)}
          </select>
        </FormField>
        <FormField label="Soil Type" htmlFor="soilType">
          <select id="soilType" name="soilType" value={formData.soilType} onChange={onFormChange} className={sharedInputClasses}>
            {Object.values(SoilType).map(soil => <option key={soil} value={soil}>{soil}</option>)}
          </select>
        </FormField>
      </div>

      <FormField label={`Average Annual Rainfall (mm)`} htmlFor="rainfall">
          <input type="number" id="rainfall" name="rainfall" value={formData.rainfall} onChange={onFormChange} placeholder="e.g., 1200" className={sharedInputClasses} />
      </FormField>

      <FormField label={`Average Temperature (°C)`} htmlFor="temperature">
          <input type="number" id="temperature" name="temperature" value={formData.temperature} onChange={onFormChange} placeholder="e.g., 25" className={sharedInputClasses} />
      </FormField>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormField label="Fertilizer (kg/ha)" htmlFor="fertilizer">
          <input type="number" id="fertilizer" name="fertilizer" value={formData.fertilizer} onChange={onFormChange} placeholder="e.g., 150" className={sharedInputClasses} />
        </FormField>
        <FormField label="Pesticide (kg/ha)" htmlFor="pesticide">
          <input type="number" id="pesticide" name="pesticide" value={formData.pesticide} onChange={onFormChange} placeholder="e.g., 30" className={sharedInputClasses} />
        </FormField>
      </div>
      
       <FormField label="Year" htmlFor="year">
          <input type="number" id="year" name="year" value={formData.year} onChange={onFormChange} placeholder="e.g., 2024" className={sharedInputClasses} />
      </FormField>


      <button type="submit" disabled={isLoading} className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:bg-gray-400 disabled:cursor-not-allowed transition duration-150 ease-in-out">
        {isLoading ? (
          <>
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Predicting...
          </>
        ) : 'Predict Yield'}
      </button>
    </form>
  );
};
