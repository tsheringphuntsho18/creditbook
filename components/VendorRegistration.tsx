import React, { useState } from 'react';
import { ShopType, VendorRegistrationData } from '../types';
import { SHOP_TYPE_OPTIONS } from '../constants';
import { ArrowLeftIcon } from './icons/ArrowLeftIcon';
import { UserIcon } from './icons/UserIcon';
import { PhoneIcon } from './icons/PhoneIcon';
import { ShopIcon } from './icons/ShopIcon';
import { LocationIcon } from './icons/LocationIcon';
import { DescriptionIcon } from './icons/DescriptionIcon';
import { ImageIcon } from './icons/ImageIcon';
import { XIcon } from './icons/XIcon';
import { LockIcon } from './icons/LockIcon';

interface VendorRegistrationProps {
  onBack: () => void;
  onRegistrationSuccess: (data: VendorRegistrationData) => void;
}

const VendorRegistration: React.FC<VendorRegistrationProps> = ({ onBack, onRegistrationSuccess }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<VendorRegistrationData>({
    fullName: '',
    phoneNumber: '',
    password: '',
    shopName: '',
    shopType: ShopType.GENERAL_STORE,
    shopLocation: '',
    shopDescription: '',
    shopLogo: '',
  });
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, shopLogo: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveLogo = () => {
    setFormData(prev => ({ ...prev, shopLogo: '' }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (step === 1) {
        if (formData.password.length < 6) {
          setError('Password must be at least 6 characters long.');
          return;
        }
        if (formData.password !== confirmPassword) {
          setError('Passwords do not match.');
          return;
        }
        nextStep();
    } else {
        console.log('Vendor Registration Data:', formData);
        onRegistrationSuccess(formData);
    }
  };
  
  const nextStep = () => setStep(prev => prev + 1);
  const prevStep = () => setStep(prev => prev - 1);

  const renderInput = (id: keyof VendorRegistrationData, label: string, type: string, placeholder: string, icon: React.ReactElement, required = true, value?: string, onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void) => (
    <div>
        <label htmlFor={id} className="block text-sm font-medium text-content-light-secondary dark:text-content-dark-secondary">{label}</label>
        <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                {icon}
            </div>
            <input
                id={id}
                name={id}
                type={type}
                required={required}
                className="appearance-none block w-full px-3 py-3 pl-10 bg-transparent border border-gray-300 dark:border-gray-600 rounded-md placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                placeholder={placeholder}
                value={value ?? formData[id as keyof Omit<VendorRegistrationData, 'shopType' | 'shopDescription' | 'shopLogo' | 'password'>]}
                onChange={onChange ?? handleChange}
            />
        </div>
    </div>
  );

  return (
    <div className="w-full max-w-lg p-8 space-y-6 bg-background-light-primary dark:bg-background-dark-secondary rounded-xl shadow-2xl relative">
      <button onClick={step === 1 ? onBack : prevStep} className="absolute top-4 left-4 text-content-light-secondary dark:text-content-dark-secondary hover:text-content-light-primary dark:hover:text-content-dark-primary transition-colors">
        <ArrowLeftIcon />
      </button>

      <div className="text-center">
        <h2 className="text-2xl font-bold text-content-light-primary dark:text-content-dark-primary">Register Your Shop</h2>
        <p className="text-sm text-content-light-secondary dark:text-content-dark-secondary mt-1">{step === 1 ? 'Step 1 of 2: Your Details' : 'Step 2 of 2: Shop Details'}</p>
      </div>

      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
        <div className="bg-primary h-2 rounded-full transition-all duration-500 ease-out" style={{ width: `${step * 50}%` }}></div>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4 pt-4">
        {error && (
            <div className="bg-danger/10 text-center text-sm text-danger-dark dark:text-danger-light p-3 rounded-md">
              <p>{error}</p>
            </div>
          )}
        {step === 1 && (
            <>
                {renderInput("fullName", "Full Name", "text", "John Doe", <UserIcon/>)}
                {renderInput("phoneNumber", "Phone Number", "tel", "8-digit mobile number", <PhoneIcon/>)}
                {renderInput("password", "Password", "password", "Min. 6 characters", <LockIcon/>, true, formData.password, handleChange)}
                {renderInput("confirmPassword" as any, "Confirm Password", "password", "Re-enter your password", <LockIcon/>, true, confirmPassword, (e) => setConfirmPassword(e.target.value))}
                <button
                    type="submit"
                    className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-light focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                >
                    Next: Shop Details
                </button>
            </>
        )}
        {step === 2 && (
            <>
                {renderInput("shopName", "Shop Name", "text", "e.g., The Corner Store", <ShopIcon/>)}
                {renderInput("shopLocation", "Shop Location", "text", "e.g., 123 Main St, Anytown", <LocationIcon/>)}
                 <div>
                  <label htmlFor="shopType" className="block text-sm font-medium text-content-light-secondary dark:text-content-dark-secondary">Shop Type</label>
                  <select
                    id="shopType"
                    name="shopType"
                    required
                    value={formData.shopType}
                    onChange={handleChange}
                    className="mt-1 block w-full pl-3 pr-10 py-3 bg-transparent text-base border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md"
                  >
                    {SHOP_TYPE_OPTIONS.map((option) => (
                      <option className="bg-white dark:bg-black" key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
                 <div>
                    <label htmlFor="shopDescription" className="block text-sm font-medium text-content-light-secondary dark:text-content-dark-secondary">Shop Description (Optional)</label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                        <div className="absolute top-3.5 left-0 pl-3 flex items-start pointer-events-none">
                            <DescriptionIcon />
                        </div>
                        <textarea
                            id="shopDescription"
                            name="shopDescription"
                            rows={3}
                            className="appearance-none block w-full px-3 py-2 pl-10 bg-transparent border border-gray-300 dark:border-gray-600 rounded-md placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                            placeholder="Tell customers about your shop..."
                            value={formData.shopDescription}
                            onChange={handleChange}
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-content-light-secondary dark:text-content-dark-secondary">Shop Logo (Optional)</label>
                    <div className="mt-2 flex items-center gap-4">
                      {formData.shopLogo ? (
                        <div className="relative">
                          <img src={formData.shopLogo} alt="Shop logo preview" className="h-20 w-20 rounded-full object-cover border-2 border-gray-200 dark:border-gray-700" />
                          <button type="button" onClick={handleRemoveLogo} className="absolute -top-1 -right-1 bg-danger text-white rounded-full p-0.5 hover:bg-danger-light">
                            <XIcon />
                          </button>
                        </div>
                      ) : (
                        <label htmlFor="shopLogo" className="flex flex-col items-center justify-center w-20 h-20 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-full text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer">
                          <ImageIcon />
                          <span className="text-xs mt-1">Logo</span>
                        </label>
                      )}
                      <input id="shopLogo" name="shopLogo" type="file" className="hidden" onChange={handleFileChange} accept="image/png, image/jpeg, image/webp"/>
                      <p className="text-xs text-content-light-secondary dark:text-content-dark-secondary">Upload a square logo. It will be displayed as a circle.</p>
                    </div>
                </div>
                <button
                  type="submit"
                  className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-light focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                >
                  Complete Registration
                </button>
            </>
        )}
      </form>
    </div>
  );
};

export default VendorRegistration;