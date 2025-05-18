// Utils for managing auth tokens
const refreshTokenIfNeeded = async (forceRefresh = false) => {
  try {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      console.warn('No access token found');
      return false;
    }
    
    // Check if token is expired by attempting to decode it
    const tokenData = parseJwt(token);
    const currentTime = Date.now() / 1000;
    
    // If token is expired, about to expire in the next 5 minutes, or if a refresh is forced
    if (forceRefresh || !tokenData.exp || tokenData.exp < currentTime + 300) {
      console.log('Token expired or refresh requested, attempting refresh...');
      return await refreshToken();
    }
    
    return true;
  } catch (error) {
    console.error('Error refreshing token:', error);
    return false;
  }
};

// Parse JWT without using external libraries
const parseJwt = (token) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map((c) => {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Error parsing JWT token:', error);
    return {};
  }
};

// Refresh token function
const refreshToken = async () => {
  try {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) {
      console.warn('No refresh token available');
      return false;
    }
    
    const response = await fetch('http://localhost:3000/api/auth/refresh', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ refreshToken })
    });
    
    if (!response.ok) {
      throw new Error('Failed to refresh token');
    }
    
    const data = await response.json();
    localStorage.setItem('accessToken', data.accessToken);
    
    if (data.refreshToken) {
      localStorage.setItem('refreshToken', data.refreshToken);
    }
    
    return true;
  } catch (error) {
    console.error('Token refresh failed:', error);
    return false;
  }
};

export { refreshTokenIfNeeded, parseJwt };
