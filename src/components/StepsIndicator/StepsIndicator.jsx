import { Check } from 'lucide-react';
import './StepsIndicator.css';

function StepsIndicator({ currentStep }) {
    const steps = [
        { number: 1, label: 'Service' },
        { number: 2, label: 'Date & Time' },
        { number: 3, label: 'Details' },
        { number: 4, label: 'Confirm' }
    ];

    return (
        <div className="steps">
            {steps.map((step, index) => (
                <div key={step.number} className="step-wrapper">
                    <div
                        className={`step ${currentStep === step.number ? 'active' : ''
                            } ${currentStep > step.number ? 'completed' : ''
                            }`}
                    >
                        <div className="step-number">
                            {currentStep > step.number ? (
                                <Check size={16} strokeWidth={3} />
                            ) : (
                                step.number
                            )}
                        </div>
                        <span className="step-label">{step.label}</span>
                    </div>

                    {index < steps.length - 1 && (
                        <div className={`step-connector ${currentStep > step.number ? 'completed' : ''}`} />
                    )}
                </div>
            ))}
        </div>
    );
}

export default StepsIndicator;
