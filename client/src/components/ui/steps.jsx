export const Steps = ({ currentStep, totalSteps, steps }) => {
  return (
    <div className="flex items-center justify-between">
      {steps.map((step, index) => (
        <div key={index} className="flex items-center">
          <div
            className={`flex items-center justify-center w-8 h-8 rounded-full flex-shrink-0 flex-grow-0 ${
              index + 1 <= currentStep ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
            }`}
          >
            {index + 1}
          </div>
          <div className="ml-2">
            <div className="text-sm font-medium">{step.title}</div>
            <div className="text-xs text-gray-500">{step.description}</div>
          </div>
          {index < steps.length - 1 && (
            <div
              className={`w-full h-1 mx-4 ${
                index + 1 < currentStep ? 'bg-blue-600' : 'bg-gray-200'
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );
};
