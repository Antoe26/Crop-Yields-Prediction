import React, { useState, useMemo } from 'react';
import { PredictionOutput, CropType, AnalysisDataPoint, ModelComparison } from '../types';
import { WheatIcon, MaizeIcon, RiceIcon, BarleyIcon, SoybeansIcon } from './icons/CropIcons';

interface ResultDisplayProps {
  prediction: PredictionOutput | null;
  isLoading: boolean;
  error: string | null;
  cropType: CropType;
}

const CropIcon = ({ cropType }: { cropType: CropType }) => {
    const iconMap: Record<CropType, React.ReactElement> = {
        [CropType.MAIZE]: <MaizeIcon />,
        [CropType.RICE]: <RiceIcon />,
        [CropType.WHEAT]: <WheatIcon />,
        [CropType.BARLEY]: <BarleyIcon />,
        [CropType.SOYBEANS]: <SoybeansIcon />,
    };
    return <div className="w-16 h-16 mx-auto text-green-500">{iconMap[cropType]}</div>;
}

const SkeletonLoader = () => (
    <div className="animate-pulse space-y-4">
        <div className="h-16 w-16 bg-gray-300 dark:bg-gray-600 rounded-full mx-auto"></div>
        <div className="h-10 w-3/4 bg-gray-300 dark:bg-gray-600 rounded-md mx-auto"></div>
        <div className="h-4 w-full bg-gray-300 dark:bg-gray-600 rounded-md"></div>
        <div className="h-4 w-5/6 bg-gray-300 dark:bg-gray-600 rounded-md"></div>
        <div className="h-40 mt-4 w-full bg-gray-300 dark:bg-gray-600 rounded-md"></div>
    </div>
);

const AnalysisChart: React.FC<{ data: AnalysisDataPoint[], xLabel: string, yLabel: string, color: string }> = ({ data, xLabel, yLabel, color }) => {
    const svgWidth = 350;
    const svgHeight = 250;
    const padding = { top: 20, right: 20, bottom: 50, left: 60 };
    
    const chartWidth = svgWidth - padding.left - padding.right;
    const chartHeight = svgHeight - padding.top - padding.bottom;

    const { xMin, xMax, yMin, yMax, linePath, points } = useMemo(() => {
        if (!data || data.length === 0) return { xMin: 0, xMax: 1, yMin: 0, yMax: 1, linePath: '', points: [] };

        const xMin = Math.min(...data.map(d => d.value));
        const xMax = Math.max(...data.map(d => d.value));
        const yData = data.map(d => d.yield);
        const yMin = Math.min(...yData);
        const yMax = Math.max(...yData);
        const yRange = yMax - yMin;

        const yDomainMin = yMin - yRange * 0.1;
        const yDomainMax = yMax + yRange * 0.1;

        const xScale = (value: number) => padding.left + ((value - xMin) / (xMax - xMin)) * chartWidth;
        const yScale = (value: number) => padding.top + chartHeight - (((value - yDomainMin) / (yDomainMax - yDomainMin)) * chartHeight);

        const linePath = data.map((d, i) => `${i === 0 ? 'M' : 'L'} ${xScale(d.value)} ${yScale(d.yield)}`).join(' ');
        const points = data.map(d => ({ x: xScale(d.value), y: yScale(d.yield) }));

        return { xMin, xMax, yMin: yDomainMin, yMax: yDomainMax, linePath, points };
    }, [data, chartWidth, chartHeight]);

    const formatLabel = (val: number) => val > 1000 ? `${(val/1000).toFixed(1)}k` : val.toFixed(0);

    return (
        <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full h-full text-gray-500 dark:text-gray-400">
            {/* Axes and Grid Lines */}
            <line x1={padding.left} y1={padding.top + chartHeight} x2={padding.left + chartWidth} y2={padding.top + chartHeight} stroke="currentColor" strokeWidth="0.5" />
            <line x1={padding.left} y1={padding.top} x2={padding.left} y2={padding.top + chartHeight} stroke="currentColor" strokeWidth="0.5" />
            
            {/* Y-Axis Labels */}
            {[0, 0.25, 0.5, 0.75, 1].map(tick => (
                <text key={tick} x={padding.left - 8} y={padding.top + chartHeight * (1 - tick) + 4} textAnchor="end" fontSize="10" className="fill-current">{formatLabel(yMin + (yMax - yMin) * tick)}</text>
            ))}

            {/* X-Axis Labels */}
            {points.map((p, i) => (
                <text key={i} x={p.x} y={padding.top + chartHeight + 15} textAnchor="middle" fontSize="10" className="fill-current">{formatLabel(data[i].value)}</text>
            ))}

            {/* Axis Titles */}
            <text x={padding.left + chartWidth / 2} y={svgHeight - 10} textAnchor="middle" fontSize="12" className="font-medium fill-current">{xLabel}</text>
            <text transform={`rotate(-90) translate(-${padding.top + chartHeight/2}, 15)`} textAnchor="middle" fontSize="12" className="font-medium fill-current">{yLabel}</text>

            {/* Data Line */}
            <path d={linePath} fill="none" stroke={color} strokeWidth="2" />

            {/* Data Points */}
            {points.map((p, i) => <circle key={i} cx={p.x} cy={p.y} r="3" fill={color} />)}
        </svg>
    );
};

const suitabilityClasses: Record<string, string> = {
  High: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
  Medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
  Low: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
};

const CheckIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const CrossIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);


const ModelComparisonCard: React.FC<{ model: ModelComparison }> = ({ model }) => (
    <div className="bg-white dark:bg-gray-700/50 p-4 rounded-lg border border-gray-200 dark:border-gray-600 flex flex-col h-full">
        <div className="flex justify-between items-center mb-3">
            <h5 className="font-bold text-gray-900 dark:text-white">{model.modelName}</h5>
            <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${suitabilityClasses[model.suitability]}`}>
                {model.suitability}
            </span>
        </div>
        
        <div className="mb-4 p-3 bg-gray-100 dark:bg-gray-800 rounded-md text-sm">
            <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-300">R-squared:</span>
                <span className="font-mono font-semibold text-gray-800 dark:text-gray-100">{model.metrics.rSquared}</span>
            </div>
            <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-300">MAE:</span>
                <span className="font-mono font-semibold text-gray-800 dark:text-gray-100">{model.metrics.mae}</span>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">{model.metrics.explanation}</p>
        </div>

        <div className="mb-3">
            <h6 className="font-semibold text-sm text-green-600 dark:text-green-400 mb-2">Pros</h6>
            <ul className="space-y-1.5 text-sm text-gray-600 dark:text-gray-300">
                {model.pros.map((pro, i) => (
                    <li key={i} className="flex items-start">
                        <CheckIcon className="w-4 h-4 mr-2 mt-0.5 text-green-500 flex-shrink-0" />
                        <span>{pro}</span>
                    </li>
                ))}
            </ul>
        </div>
        
        <div className="mt-auto">
            <h6 className="font-semibold text-sm text-red-600 dark:text-red-400 mb-2">Cons</h6>
            <ul className="space-y-1.5 text-sm text-gray-600 dark:text-gray-300">
                {model.cons.map((con, i) => (
                    <li key={i} className="flex items-start">
                        <CrossIcon className="w-4 h-4 mr-2 mt-0.5 text-red-500 flex-shrink-0" />
                        <span>{con}</span>
                    </li>
                ))}
            </ul>
        </div>
    </div>
);


export const ResultDisplay: React.FC<ResultDisplayProps> = ({ prediction, isLoading, error, cropType }) => {
  type AnalysisType = 'rainfall' | 'temperature' | 'fertilizer';
  const [activeAnalysis, setActiveAnalysis] = useState<AnalysisType>('rainfall');

  const analysisConfig: Record<AnalysisType, { label: string, xLabel: string, color: string }> = {
    rainfall: { label: 'Rainfall', xLabel: 'Rainfall (mm)', color: '#3b82f6' },
    temperature: { label: 'Temperature', xLabel: 'Temperature (°C)', color: '#ef4444' },
    fertilizer: { label: 'Fertilizer', xLabel: 'Fertilizer (kg/ha)', color: '#f97316' },
  }

  if (isLoading) {
    return <div className="text-center p-4"><SkeletonLoader /></div>;
  }

  if (error) {
    return (
      <div className="text-center p-4 bg-red-100 dark:bg-red-900/50 border border-red-400 dark:border-red-600 text-red-700 dark:text-red-300 rounded-lg">
        <h3 className="font-bold text-lg mb-2">Error</h3>
        <p>{error}</p>
      </div>
    );
  }
  
  if (!prediction) {
    return (
        <div className="text-center p-4 flex flex-col items-center justify-center h-full text-gray-500 dark:text-gray-400">
             <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mb-4 text-gray-400 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <h3 className="font-semibold text-lg">Awaiting Prediction</h3>
            <p>Fill out the form and click "Predict Yield" to see the forecast.</p>
        </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center p-4 space-y-4">
          <CropIcon cropType={cropType} />
          <div>
              <p className="text-lg text-gray-600 dark:text-gray-300">Predicted {cropType} Yield</p>
              <p className="text-5xl font-extrabold text-green-600 dark:text-green-400">
                  {prediction.predictedYield.toLocaleString(undefined, { maximumFractionDigits: 2 })}
              </p>
              <p className="text-lg font-medium text-gray-700 dark:text-gray-200">kg / hectare</p>
          </div>
      </div>

      <div className="p-4 bg-green-50 dark:bg-green-900/30 rounded-lg border border-green-200 dark:border-green-800">
          <h4 className="font-semibold text-gray-800 dark:text-gray-100 mb-1">AI Justification</h4>
          <p className="text-sm text-gray-600 dark:text-gray-300">{prediction.justification}</p>
      </div>

       <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          <h4 className="font-semibold text-lg text-gray-800 dark:text-gray-100 mb-3">Sensitivity Analysis</h4>
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
            See how yield changes when a single factor is adjusted while others remain constant.
          </p>
          <div className="flex justify-center border-b border-gray-300 dark:border-gray-600 mb-4">
            {(Object.keys(analysisConfig) as AnalysisType[]).map(key => (
              <button 
                key={key}
                onClick={() => setActiveAnalysis(key)}
                className={`px-4 py-2 text-sm font-medium transition-colors duration-200 -mb-px border-b-2 ${activeAnalysis === key ? 'border-green-500 text-green-600 dark:text-green-400' : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-200'}`}
              >
                {analysisConfig[key].label}
              </button>
            ))}
          </div>
          <div className="w-full h-64 mx-auto">
             <AnalysisChart 
                data={prediction.analysis[activeAnalysis]} 
                xLabel={analysisConfig[activeAnalysis].xLabel}
                yLabel="Predicted Yield (kg/ha)"
                color={analysisConfig[activeAnalysis].color}
             />
          </div>
        </div>

        <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          <h4 className="font-semibold text-lg text-gray-800 dark:text-gray-100 mb-4">Model Comparison Insights</h4>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {prediction.modelComparison.map((model, index) => (
              <ModelComparisonCard key={index} model={model} />
            ))}
          </div>
        </div>

    </div>
  );
};