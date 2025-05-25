interface ProgressStepsProps {
    steps: string[];
    currentStep: number;
    className?: string;
}

export const ProgressSteps: React.FC<ProgressStepsProps> = ({
    steps,
    currentStep,
    className = ""
}) => {
    return (
        <div className={`flex items-center justify-between mb-6 ${className}`}>
            {steps.map((step, index) => (
                <div key={index} className="flex items-center">
                    <div className={`
            flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium
            ${index <= currentStep
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-gray-200 text-gray-600'
                        }
          `}>
                        {index + 1}
                    </div>
                    {index < steps.length - 1 && (
                        <div className={`
              h-px w-12 mx-2
              ${index < currentStep ? 'bg-primary' : 'bg-gray-200'}
            `} />
                    )}
                </div>
            ))}
        </div>
    );
};