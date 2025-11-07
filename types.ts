export enum CropType {
  MAIZE = 'Maize',
  RICE = 'Rice',
  WHEAT = 'Wheat',
  BARLEY = 'Barley',
  SOYBEANS = 'Soybeans'
}

export enum SoilType {
  LOAMY = 'Loamy',
  CLAY = 'Clay',
  SANDY = 'Sandy',
  SILTY = 'Silty',
  PEATY = 'Peaty'
}

export interface PredictionInput {
  cropType: CropType;
  rainfall: number;
  temperature: number;
  fertilizer: number;
  soilType: SoilType;
  pesticide: number;
  year: number;
}

export interface AnalysisDataPoint {
  value: number;
  yield: number;
}

export interface SensitivityAnalysis {
  rainfall: AnalysisDataPoint[];
  temperature: AnalysisDataPoint[];
  fertilizer: AnalysisDataPoint[];
}

export interface ModelComparison {
  modelName: string;
  pros: string[];
  cons: string[];
  suitability: 'High' | 'Medium' | 'Low';
  metrics: {
      rSquared: string;
      mae: string;
      explanation: string;
  };
}

export interface PredictionOutput {
  predictedYield: number;
  justification: string;
  analysis: SensitivityAnalysis;
  modelComparison: ModelComparison[];
}