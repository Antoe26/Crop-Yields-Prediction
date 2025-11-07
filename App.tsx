
import React, { useState, useCallback } from 'react';
import { PredictionForm } from './components/PredictionForm';
import { ResultDisplay } from './components/ResultDisplay';
import { Header } from './components/Header';
import { predictYield } from './services/geminiService';
import { PredictionInput, PredictionOutput, CropType, SoilType } from './types';

function App() {
  const [formData, setFormData] = useState<PredictionInput>({
    cropType: CropType.MAIZE,
    rainfall: 1200,
    temperature: 25,
    fertilizer: 150,
    soilType: SoilType.LOAMY,
    pesticide: 30,
    year: new Date().getFullYear(),
  });
  const [prediction, setPrediction] = useState<PredictionOutput | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleFormChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: e.target.type === 'number' ? parseFloat(value) || 0 : value,
    }));
  }, []);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setPrediction(null);
    try {
      const result = await predictYield(formData);
      setPrediction(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  }, [formData]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-teal-50 to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-slate-900 text-gray-800 dark:text-gray-200 font-sans">
      <Header />
      <main className="container mx-auto p-4 md:p-8">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          <div className="bg-white dark:bg-gray-800/50 p-6 md:p-8 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Prediction Parameters</h2>
            <PredictionForm
              formData={formData}
              onFormChange={handleFormChange}
              onSubmit={handleSubmit}
              isLoading={isLoading}
            />
          </div>
          <div className="bg-white dark:bg-gray-800/50 p-6 md:p-8 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700">
             <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Yield Forecast</h2>
            <ResultDisplay
              prediction={prediction}
              isLoading={isLoading}
              error={error}
              cropType={formData.cropType}
            />
          </div>
        </div>
      </main>
      <footer className="text-center p-4 mt-8 text-gray-500 dark:text-gray-400 text-sm">
        <p>Powered by Gemini. Predictions are for informational purposes only.</p>
      </footer>
    </div>
  );
}

export default App;
