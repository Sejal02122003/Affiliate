import React from 'react';
import { type Address  } from './AddressPage';

interface AddressCardProps {
    address: Address;
    onEdit: (id: string) => void;
    onDelete: (id: string) => void;
    onSetDefault: (id: string) => void;
}

const AddressCard: React.FC<AddressCardProps> = ({ address, onEdit, onDelete, onSetDefault }) => {
    const { id, name, mobile, addressLine1, addressLine2, city, state, pincode, isDefault, addressType } = address;

    // Get card styling based on address type
    const getCardStyles = () => {
        switch (addressType) {
            case 'home':
                return {
                    icon: (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                        </svg>
                    ),
                    label: 'Home',
                    bgColor: 'bg-blue-50',
                    textColor: 'text-blue-700',
                    borderColor: 'border-blue-200',
                    accentColor: 'from-blue-500 to-indigo-600'
                };
            case 'work':
                return {
                    icon: (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                    ),
                    label: 'Work',
                    bgColor: 'bg-purple-50',
                    textColor: 'text-purple-700',
                    borderColor: 'border-purple-200',
                    accentColor: 'from-purple-500 to-pink-500'
                };
            default:
                return {
                    icon: (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                    ),
                    label: 'Other',
                    bgColor: 'bg-green-50',
                    textColor: 'text-green-700',
                    borderColor: 'border-green-200',
                    accentColor: 'from-green-500 to-teal-500'
                };
        }
    };

    const styles = getCardStyles();

    return (
        <div className={`bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl relative group border border-gray-100 ${isDefault ? 'ring-2 ring-primary-500 ring-offset-2' : ''}`}>
            {/* Card accent based on address type */}
            <div className={`h-1.5 w-full bg-gradient-to-r ${styles.accentColor}`}></div>

            <div className="p-5">
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <h3 className="text-lg font-semibold text-gray-800">{name}</h3>
                        <p className="text-gray-500 text-sm mt-1">{mobile}</p>
                    </div>

                    {/* Type badge */}
                    <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${styles.bgColor} ${styles.textColor} border ${styles.borderColor} flex items-center`}
                    >
                        <span className="mr-1">{styles.icon}</span>
                        {styles.label}
                    </span>
                </div>

                {/* Address details */}
                <div className="space-y-1 mb-4">
                    <p className="text-gray-700">{addressLine1}</p>
                    {addressLine2 && <p className="text-gray-700">{addressLine2}</p>}
                    <p className="text-gray-700">{city}, {state} - {pincode}</p>
                </div>

                {/* Default badge */}
                {isDefault && (
                    <div className="mb-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800 border border-primary-200">
                            <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            Default Address
                        </span>
                    </div>
                )}

                {/* Card actions */}
                <div className="flex justify-between items-center mt-4 pt-3 border-t border-gray-100">
                    {/* Delete button */}
                    <button
                        onClick={() => onDelete(id)}
                        className="flex items-center px-3 py-1.5 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                        aria-label="Delete address"
                    >
                        <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        Delete
                    </button>

                    <div className="flex space-x-2">
                        {/* Set as default button - only show if not already default */}
                        {!isDefault && (
                            <button
                                onClick={() => onSetDefault(id)}
                                className="flex items-center px-3 py-1.5 text-sm font-medium text-primary-600 hover:text-primary-700 hover:bg-primary-50 rounded-lg transition-colors"
                                aria-label="Set as default address"
                            >
                                <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                Set Default
                            </button>
                        )}

                        {/* Edit button */}
                        <button
                            onClick={() => onEdit(id)}
                            className="flex items-center px-3 py-1.5 text-sm font-medium text-gray-600 hover:text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                            aria-label="Edit address"
                        >
                            <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                            </svg>
                            Edit
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddressCard;