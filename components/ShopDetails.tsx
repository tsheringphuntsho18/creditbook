import React, { useState } from 'react';
import { ShopType, VendorRegistrationData, ShopStatus } from '../types';
import { SHOP_TYPE_OPTIONS } from '../constants';
import { PencilIcon } from './icons/PencilIcon';
import { ShopIcon } from './icons/ShopIcon';
import { LocationIcon } from './icons/LocationIcon';
import { DescriptionIcon } from './icons/DescriptionIcon';
import { CheckIcon } from './icons/CheckIcon';
import { XIcon } from './icons/XIcon';
import ToggleSwitch from './ToggleSwitch';
import { ImageIcon } from './icons/ImageIcon';

interface ShopDetailsProps {
  shopDetails: VendorRegistrationData;
  onUpdate: (updatedDetails: VendorRegistrationData) => void;
  onStatusChange: (newStatus: ShopStatus) => void;
}

const ShopDetails: React.FC<ShopDetailsProps> = ({ shopDetails, onUpdate, onStatusChange }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<VendorRegistrationData>(shopDetails);

  const handleEditClick = () => {
    setFormData(shopDetails);
    setIsEditing(true);
  };

  const handleCancel = () => setIsEditing(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value as ShopType }));
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

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate(formData);
    setIsEditing(false);
  };

  const isShopOpen = shopDetails.shopStatus === ShopStatus.OPEN;

  const renderInput = (id: keyof VendorRegistrationData, label: string, required = true) => (
    <div>
        <label htmlFor={id} className="block text-sm font-medium text-content-light-secondary dark:text-content-dark-secondary">{label}</label>
        <input type="text" id={id} name={id} value={formData[id as 'shopName' | 'shopLocation']} onChange={handleChange} className="mt-1 block w-full bg-transparent px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" required={required} />
    </div>
  );

  if (isEditing) {
    return (
      <div className="bg-background-light-primary dark:bg-background-dark-secondary p-4 rounded-xl">
        <h2 className="text-xl font-semibold text-content-light-primary dark:text-content-dark-primary mb-4">Edit Shop Details</h2>
        <form onSubmit={handleSave} className="space-y-4">
          {renderInput("shopName", "Shop Name")}
          {renderInput("shopLocation", "Shop Location")}
           <div>
              <label htmlFor="shopType" className="block text-sm font-medium text-content-light-secondary dark:text-content-dark-secondary">Shop Type</label>
              <select
                id="shopType"
                name="shopType"
                required
                value={formData.shopType}
                onChange={handleChange}
                className="mt-1 block w-full pl-3 pr-10 py-2 bg-transparent text-base border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md"
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
                <textarea
                    id="shopDescription"
                    name="shopDescription"
                    rows={3}
                    className="mt-1 appearance-none block w-full px-3 py-2 bg-transparent border border-gray-300 dark:border-gray-600 rounded-md placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                    placeholder="Tell customers about your shop..."
                    value={formData.shopDescription}
                    onChange={handleChange}
                />
            </div>
          <div>
            <label className="block text-sm font-medium text-content-light-secondary dark:text-content-dark-secondary">Shop Logo</label>
            <div className="mt-2 flex items-center gap-4">
              {formData.shopLogo ? (
                <div className="relative">
                  <img src={formData.shopLogo} alt="Shop logo preview" className="h-16 w-16 rounded-full object-cover border-2 border-gray-200 dark:border-gray-700" />
                  <button type="button" onClick={handleRemoveLogo} className="absolute -top-1 -right-1 bg-danger text-white rounded-full p-0.5 hover:bg-danger-light">
                    <XIcon />
                  </button>
                </div>
              ) : (
                <label htmlFor="shopLogoEdit" className="flex flex-col items-center justify-center w-16 h-16 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-full text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer">
                  <ImageIcon />
                  <span className="text-xs mt-1">Logo</span>
                </label>
              )}
              <input id="shopLogoEdit" name="shopLogo" type="file" className="hidden" onChange={handleFileChange} accept="image/png, image/jpeg, image/webp"/>
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={handleCancel} className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-content-light-secondary dark:text-content-dark-secondary bg-gray-200 dark:bg-gray-700 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500">
                <XIcon /> <span>Cancel</span>
            </button>
            <button type="submit" className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-white bg-primary rounded-md hover:bg-primary-light focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
                <CheckIcon /> <span>Save</span>
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="bg-background-light-primary dark:bg-background-dark-secondary p-4 rounded-xl relative">
        <div className="flex items-start justify-between mb-4">
             <div className="flex items-center gap-4">
                {shopDetails.shopLogo && (
                    <img src={shopDetails.shopLogo} alt="Shop Logo" className="h-16 w-16 rounded-full object-cover" />
                )}
                <div>
                    <h2 className="text-xl font-semibold text-content-light-primary dark:text-content-dark-primary">{shopDetails.shopName}</h2>
                </div>
             </div>
            <button onClick={handleEditClick} className="p-2 text-content-light-secondary dark:text-content-dark-secondary hover:text-primary rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors" aria-label="Edit Shop Details">
                <PencilIcon />
            </button>
        </div>
        <div className="grid grid-cols-1 gap-y-4 text-content-light-primary dark:text-content-dark-primary">
            <div className="flex items-start gap-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mt-1 text-content-light-secondary dark:text-content-dark-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
                <div>
                    <span className="text-sm font-medium text-content-light-secondary dark:text-content-dark-secondary">Shop Type</span>
                    <p className="font-semibold">{shopDetails.shopType}</p>
                </div>
            </div>
            <div className="flex items-start gap-3">
                <div className="mt-1 text-content-light-secondary dark:text-content-dark-secondary"><LocationIcon /></div>
                <div>
                    <span className="text-sm font-medium text-content-light-secondary dark:text-content-dark-secondary">Location</span>
                    <p className="font-semibold">{shopDetails.shopLocation}</p>
                </div>
            </div>
            <div className="flex items-start gap-3">
                <div className="mt-1 text-content-light-secondary dark:text-content-dark-secondary"><DescriptionIcon /></div>
                <div>
                    <span className="text-sm font-medium text-content-light-secondary dark:text-content-dark-secondary">Description</span>
                    <p className="italic text-content-light-secondary dark:text-content-dark-secondary">{shopDetails.shopDescription || 'No description provided.'}</p>
                </div>
            </div>
        </div>
         <div className="flex items-center justify-between border-t border-gray-200 dark:border-gray-700 mt-6 pt-4">
            <div className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${isShopOpen ? 'bg-success' : 'bg-danger'}`}></div>
                <span className="font-semibold text-content-light-primary dark:text-content-dark-primary">
                    Shop Status
                </span>
            </div>
            <ToggleSwitch
                isOn={isShopOpen}
                onToggle={() => onStatusChange(isShopOpen ? ShopStatus.CLOSED : ShopStatus.OPEN)}
            />
        </div>
    </div>
  );
};

export default ShopDetails;