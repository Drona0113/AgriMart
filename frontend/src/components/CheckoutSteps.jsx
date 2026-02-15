import { Link } from 'react-router-dom';
import { Check } from 'lucide-react';

const CheckoutSteps = ({ step1, step2, step3, step4 }) => {
  const steps = [
    { name: 'Sign In', status: step1, link: '/login' },
    { name: 'Shipping', status: step2, link: '/shipping' },
    { name: 'Payment', status: step3, link: '/payment' },
    { name: 'Place Order', status: step4, link: '/placeorder' },
  ];

  return (
    <div className='flex items-center justify-center mb-12 max-w-2xl mx-auto'>
      {steps.map((step, index) => (
        <div key={step.name} className='flex items-center flex-1 last:flex-none'>
          <div className='flex flex-col items-center relative'>
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all duration-300 ${
                step.status
                  ? 'bg-primary-600 text-white shadow-lg shadow-primary-200'
                  : 'bg-gray-200 text-gray-500'
              }`}
            >
              {step.status ? (
                <Link to={step.link}>
                  <Check size={20} />
                </Link>
              ) : (
                index + 1
              )}
            </div>
            <span
              className={`absolute -bottom-6 whitespace-nowrap text-xs font-bold uppercase tracking-wider ${
                step.status ? 'text-primary-600' : 'text-gray-400'
              }`}
            >
              {step.name}
            </span>
          </div>
          {index < steps.length - 1 && (
            <div
              className={`flex-1 h-1 mx-4 rounded-full transition-all duration-300 ${
                steps[index + 1].status ? 'bg-primary-600' : 'bg-gray-200'
              }`}
            ></div>
          )}
        </div>
      ))}
    </div>
  );
};

export default CheckoutSteps;
