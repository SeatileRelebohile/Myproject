const API_BASE_URL = 'http://localhost:3001/api';

class ApiService {
  private getAuthHeaders() {
    const token = localStorage.getItem('auth_token');
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` })
    };
  }

  async register(nomineeData: any) {
    const response = await fetch(`${API_BASE_URL}/nominees/register`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(nomineeData)
    });
    return response.json();
  }

  async login(email: string, password: string) {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    return response.json();
  }

  async getNominees() {
    const response = await fetch(`${API_BASE_URL}/nominees`);
    return response.json();
  }

  async getNomineeById(id: string) {
    const response = await fetch(`${API_BASE_URL}/nominees/${id}`);
    return response.json();
  }

  async getNomineeByShareableLink(link: string) {
    const response = await fetch(`${API_BASE_URL}/nominees/share/${link}`);
    return response.json();
  }

  async updateNominee(id: string, data: any) {
    const response = await fetch(`${API_BASE_URL}/nominees/${id}`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data)
    });
    return response.json();
  }

  async vote(nomineeId: string, category: string) {
    const response = await fetch(`${API_BASE_URL}/votes`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ nomineeId, category })
    });
    return response.json();
  }

  async uploadImage(file: File) {
    const formData = new FormData();
    formData.append('image', file);
    
    const token = localStorage.getItem('auth_token');
    const response = await fetch(`${API_BASE_URL}/upload`, {
      method: 'POST',
      headers: {
        ...(token && { Authorization: `Bearer ${token}` })
      },
      body: formData
    });
    return response.json();
  }

  async requestPayment(amount: number, description: string) {
    const response = await fetch(`${API_BASE_URL}/payment-requests`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ amount, description })
    });
    return response.json();
  }

  async getPaymentRequests() {
    const response = await fetch(`${API_BASE_URL}/payment-requests`, {
      headers: this.getAuthHeaders()
    });
    return response.json();
  }
}

export const apiService = new ApiService();