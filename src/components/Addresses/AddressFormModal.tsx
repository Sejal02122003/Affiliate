import React, { useState, useEffect } from 'react';
import { type Address } from './AddressPage';

interface AddressFormModalProps {
    onClose: () => void;
    onSave: (address: Omit<Address, 'id' | 'isDefault'>, makeDefault: boolean) => void;
    editingAddress: Address | null;
}

interface AddressFormData {
    name: string;
    mobile: string;
    addressLine1: string;
    addressLine2: string;
    city: string;
    state: string;
    pincode: string;
    addressType: 'home' | 'work' | 'other';
    makeDefault: boolean;
}

const AddressFormModal: React.FC<AddressFormModalProps> = ({
    onClose,
    onSave,
    editingAddress
}) => {
    const [formData, setFormData] = useState<AddressFormData>({
        name: '',
        mobile: '',
        addressLine1: '',
        addressLine2: '',
        city: '',
        state: '',
        pincode: '',
        addressType: 'home',
        makeDefault: false
    });

    // Update form when editing address changes
    useEffect(() => {
        if (editingAddress) {
            setFormData({
                name: editingAddress.name,
                mobile: editingAddress.mobile,
                addressLine1: editingAddress.addressLine1,
                addressLine2: editingAddress.addressLine2 || '',
                city: editingAddress.city,
                state: editingAddress.state,
                pincode: editingAddress.pincode,
                addressType: editingAddress.addressType,
                makeDefault: editingAddress.isDefault
            });
        }
    }, [editingAddress]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: checked
        }));
    };

    const handleRadioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({
            ...prev,
            addressType: e.target.value as 'home' | 'work' | 'other'
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Basic validation
        if (!formData.name.trim()) {
            alert('Please enter a name');
            return;
        }

        if (!formData.mobile.trim() || !/^\d{10}$/.test(formData.mobile)) {
            alert('Please enter a valid 10-digit mobile number');
            return;
        }

        if (!formData.pincode.trim() || !/^\d{6}$/.test(formData.pincode)) {
            alert('Please enter a valid 6-digit pincode');
            return;
        }

        // Prepare data for saving
        const addressToSave: Omit<Address, 'id' | 'isDefault'> = {
            name: formData.name,
            mobile: formData.mobile,
            addressLine1: formData.addressLine1,
            addressLine2: formData.addressLine2 || undefined,
            city: formData.city,
            state: formData.state,
            pincode: formData.pincode,
            addressType: formData.addressType
        };

        onSave(addressToSave, formData.makeDefault);
    };

    return (
        <div
            className="fixed inset-0 bg-white/30 backdrop-blur-sm flex items-center justify-center z-50 transition-all duration-300 p-4"
            onClick={(e) => e.target === e.currentTarget && onClose()}
        >
            <div
                className="bg-white rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto relative animate-fadeIn"
                style={{ animation: 'fadeIn 0.3s ease-out', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)' }}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Modal header */}
                <div className="bg-gradient-to-r from-indigo-600 to-blue-500 p-4 text-white relative">
                    <div className="flex items-center justify-between">
                        <h1 className="text-xl font-bold text-white-900">{editingAddress ? 'Edit Address' : 'Add New Address'}</h1>
                        <button
                            onClick={onClose}
                            className="text-white hover:text-primary-100 transition-colors"
                            aria-label="Close"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="p-4 sm:p-6">
                    <div className="space-y-4">
                        {/* Contact Information */}
                        <div className="pb-4 border-b border-gray-200">
                            <h3 className="text-md font-medium text-gray-800 mb-3">Contact Information</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="name" className="text-sm font-medium text-gray-700 mb-1 block">
                                        Full Name <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                        required
                                        placeholder="John Doe"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="mobile" className="text-sm font-medium text-gray-700 mb-1 block">
                                        Mobile Number <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="tel"
                                        id="mobile"
                                        name="mobile"
                                        value={formData.mobile}
                                        onChange={handleChange}
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                        required
                                        placeholder="10-digit mobile number"
                                        maxLength={10}
                                        pattern="[0-9]{10}"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Address Details */}
                        <div className="pb-4 border-b border-gray-200">
                            <h3 className="text-md font-medium text-gray-800 mb-3">Address Details</h3>

                            <div className="space-y-4">
                                <div>
                                    <label htmlFor="addressLine1" className="text-sm font-medium text-gray-700 mb-1 block">
                                        Address Line 1 <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        id="addressLine1"
                                        name="addressLine1"
                                        value={formData.addressLine1}
                                        onChange={handleChange}
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                        required
                                        placeholder="House No., Building Name"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="addressLine2" className="text-sm font-medium text-gray-700 mb-1 block">
                                        Address Line 2
                                    </label>
                                    <input
                                        type="text"
                                        id="addressLine2"
                                        name="addressLine2"
                                        value={formData.addressLine2}
                                        onChange={handleChange}
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                        placeholder="Street, Area, Colony"
                                    />
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                    <div>
                                        <label htmlFor="city" className="text-sm font-medium text-gray-700 mb-1 block">
                                            City <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            id="city"
                                            name="city"
                                            value={formData.city}
                                            onChange={handleChange}
                                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                            required
                                            placeholder="City"
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="state" className="text-sm font-medium text-gray-700 mb-1 block">
                                            State <span className="text-red-500">*</span>
                                        </label>
                                        <select
                                            id="state"
                                            name="state"
                                            value={formData.state}
                                            onChange={handleChange}
                                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
                                            required
                                        >
                                            <option value="">Select State</option>
                                            <option value="Andaman and Nicobar Islands">Andaman and Nicobar Islands</option>
                                            <option value="Andhra Pradesh">Andhra Pradesh</option>
                                            <option value="Arunachal Pradesh">Arunachal Pradesh</option>
                                            <option value="Assam">Assam</option>
                                            <option value="Bihar">Bihar</option>
                                            <option value="Chandigarh">Chandigarh</option>
                                            <option value="Chhattisgarh">Chhattisgarh</option>
                                            <option value="Dadra and Nagar Haveli and Daman and Diu">Dadra and Nagar Haveli and Daman and Diu</option>
                                            <option value="Delhi">Delhi</option>
                                            <option value="Goa">Goa</option>
                                            <option value="Gujarat">Gujarat</option>
                                            <option value="Haryana">Haryana</option>
                                            <option value="Himachal Pradesh">Himachal Pradesh</option>
                                            <option value="Jammu and Kashmir">Jammu and Kashmir</option>
                                            <option value="Jharkhand">Jharkhand</option>
                                            <option value="Karnataka">Karnataka</option>
                                            <option value="Kerala">Kerala</option>
                                            <option value="Ladakh">Ladakh</option>
                                            <option value="Lakshadweep">Lakshadweep</option>
                                            <option value="Madhya Pradesh">Madhya Pradesh</option>
                                            <option value="Maharashtra">Maharashtra</option>
                                            <option value="Manipur">Manipur</option>
                                            <option value="Meghalaya">Meghalaya</option>
                                            <option value="Mizoram">Mizoram</option>
                                            <option value="Nagaland">Nagaland</option>
                                            <option value="Odisha">Odisha</option>
                                            <option value="Puducherry">Puducherry</option>
                                            <option value="Punjab">Punjab</option>
                                            <option value="Rajasthan">Rajasthan</option>
                                            <option value="Sikkim">Sikkim</option>
                                            <option value="Tamil Nadu">Tamil Nadu</option>
                                            <option value="Telangana">Telangana</option>
                                            <option value="Tripura">Tripura</option>
                                            <option value="Uttar Pradesh">Uttar Pradesh</option>
                                            <option value="Uttarakhand">Uttarakhand</option>
                                            <option value="West Bengal">West Bengal</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label htmlFor="pincode" className="text-sm font-medium text-gray-700 mb-1 block">
                                            Pincode <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            id="pincode"
                                            name="pincode"
                                            value={formData.pincode}
                                            onChange={handleChange}
                                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                            required
                                            placeholder="6-digit pincode"
                                            maxLength={6}
                                            pattern="[0-9]{6}"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Address Type */}
                        <div className="pb-4 border-b border-gray-200">
                            <h3 className="text-md font-medium text-gray-800 mb-3">Address Type</h3>
                            <div className="grid grid-cols-3 gap-3">
                                <label className={`flex items-center justify-center p-2.5 rounded-lg border-2 cursor-pointer transition-all ${formData.addressType === 'home' ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-200 hover:border-gray-300 text-gray-700'}`}>
                                    <input type="radio" name="addressType" value="home" checked={formData.addressType === 'home'} onChange={handleRadioChange} className="sr-only" />
                                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                                    </svg>
                                    <span className="font-medium text-sm">Home</span>
                                </label>

                                <label className={`flex items-center justify-center p-2.5 rounded-lg border-2 cursor-pointer transition-all ${formData.addressType === 'work' ? 'border-purple-500 bg-purple-50 text-purple-700' : 'border-gray-200 hover:border-gray-300 text-gray-700'}`}>
                                    <input type="radio" name="addressType" value="work" checked={formData.addressType === 'work'} onChange={handleRadioChange} className="sr-only" />
                                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                    <span className="font-medium text-sm">Work</span>
                                </label>

                                <label className={`flex items-center justify-center p-2.5 rounded-lg border-2 cursor-pointer transition-all ${formData.addressType === 'other' ? 'border-green-500 bg-green-50 text-green-700' : 'border-gray-200 hover:border-gray-300 text-gray-700'}`}>
                                    <input type="radio" name="addressType" value="other" checked={formData.addressType === 'other'} onChange={handleRadioChange} className="sr-only" />
                                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                    <span className="font-medium text-sm">Other</span>
                                </label>
                            </div>
                        </div>

                        {/* Default Address Option */}
                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                id="makeDefault"
                                name="makeDefault"
                                checked={formData.makeDefault}
                                onChange={handleCheckboxChange}
                                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                            />
                            <label htmlFor="makeDefault" className="ml-2 block text-sm text-gray-700">
                                Make this my default address
                            </label>
                        </div>

                        {/* Form Actions */}
                        <div className="pt-4 flex justify-end space-x-3">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-blue-500 text-white rounded-lg hover:from-indigo-700 hover:to-blue-600 font-medium transition-all"
                            >
                                {editingAddress ? 'Update Address' : 'Save Address'}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddressFormModal;