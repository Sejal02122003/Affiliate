
const API_BASE_URL = 'https://backend.glst.in/api/account/refund-payment';

//auth headers lelo
const getAuthHeaders = () => {
  const token = localStorage.getItem('token') || localStorage.getItem('authToken');
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  };
};

 
const handleApiResponse = async (response: Response) => {
  if (!response.ok) {
    let errorMessage = `HTTP error! status: ${response.status}`;
    
    try {
      const errorData = await response.json();
      if (errorData.message) {
        errorMessage = errorData.message;
      } else if (errorData.error) {
        errorMessage = errorData.error;
      }
    } catch (parseError) {
      errorMessage = response.statusText || errorMessage;
    }
    
    throw new Error(errorMessage);
  }
  
  return await response.json();
};

export interface BankAccount {
  id: number;
  account_holder_name: string;
  account_number: string;
  ifsc_code?: string;
  bank_name?: string;
  account_type: 'bank' | 'upi';
  mobile_number: string;
  upi_id?: string;
  is_default: boolean;
  created_at: string;
  updated_at: string;
}

export interface BankListResponse {
  response_code: string;
  success: boolean;
  message: string;
  data: {
    current_page: number;
    data: BankAccount[];
    first_page_url: string;
    from: number | null;
    last_page: number;
    last_page_url: string;
    links: Array<{
      url: string | null;
      label: string;
      active: boolean;
    }>;
    next_page_url: string | null;
    path: string;
    per_page: number;
    prev_page_url: string | null;
    to: number | null;
    total: number;
  };
}

export interface AddBankAccountData {
  account_holder_name: string;
  mobile_number: string;
  account_type: 'bank' | 'upi';
  account_number?: string;
  ifsc_code?: string;
  bank_name?: string;
  upi_id?: string;
}

export interface EditBankAccountData {
  refund_payment_id: number;
  account_holder_name?: string;
  mobile_number?: string;
  account_number?: string;
  ifsc_code?: string;
  bank_name?: string;
  upi_id?: string;
}

export interface SetDefaultBankData {
  refund_payment_id: number;
}

export interface DeleteBankAccountData {
  refund_payment_id: number;
}

// API Service Functions
export const bankService = {
  // Get bank accounts list with pagination
  getBankAccounts: async (page: number = 1): Promise<BankListResponse> => {
    try {
      const response = await fetch(`${API_BASE_URL}/list?page=${page}`, {
        method: 'GET',
        headers: getAuthHeaders(),
      });

      const result = await handleApiResponse(response);
      return result;
    } catch (error) {
      throw new Error(`Failed to fetch bank accounts: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  },

  // Add new bank account
  addBankAccount: async (data: AddBankAccountData): Promise<any> => {
    try {
      const response = await fetch(`${API_BASE_URL}/add`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
      });

      const result = await handleApiResponse(response);
      return result;
    } catch (error) {
      throw new Error(`Failed to add bank account: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  },

  // Edit bank account
  editBankAccount: async (data: EditBankAccountData): Promise<any> => {
    try {
      const response = await fetch(`${API_BASE_URL}/edit`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
      });

      const result = await handleApiResponse(response);
      return result;
    } catch (error) {
      throw new Error(`Failed to edit bank account: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  },

  // Set default bank account
  setDefaultBank: async (data: SetDefaultBankData): Promise<any> => {
    try {
      const response = await fetch(`${API_BASE_URL}/setdefault`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
      });

      const result = await handleApiResponse(response);
      return result;
    } catch (error) {
      throw new Error(`Failed to set default bank account: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  },

  // Delete bank account
  deleteBankAccount: async (data: DeleteBankAccountData): Promise<any> => {
    try {
      const response = await fetch(`${API_BASE_URL}/delete`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
      });

      const result = await handleApiResponse(response);
      return result;
    } catch (error) {
      throw new Error(`Failed to delete bank account: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  },
};
