const API = import.meta.env.VITE_API_URL;

export async function getProducts( queryParams ) {
  const res = await fetch(`${API}/products?${queryParams}`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' }
  });

  if (!res.ok) throw new Error(`Failed to fetch products: ${res.statusText}`);
  return res.json();
} 

export async function createProduct( product ) {
  const token = localStorage.getItem('accessToken'); // Retrieve the token from local storage

  const res = await fetch(`${API}/products`, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    }
    //FIX BODY
  });

  if (!res.ok) throw new Error(`Failed to fetch products: ${res}`);
  return res.json();
} 

export async function updateProduct( id, updatedProduct ) {
  const token = localStorage.getItem('accessToken'); // Retrieve the token from local storage

  const res = await fetch(`${API}/products/${id}`, {
    method: 'PUT',
    headers: { 
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    }
    //FIX BODY
  });

  if (!res.ok) throw new Error(`Failed to fetch products: ${res}`);
  return res.json();
} 

export async function deleteProduct( id ) {
  const token = localStorage.getItem('accessToken'); // Retrieve the token from local storage

  const res = await fetch(`${API}/products/${id}`, {
    method: 'DELETE',
    headers: { 
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    }
  });

  if (!res.ok) throw new Error(`Failed to fetch products: ${res}`);
  return res.json();
} 