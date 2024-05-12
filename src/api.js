const API_URL = 'https://wedsign-back-production.up.railway.app';

export async function getInvitations() {
  const response = await fetch(`${API_URL}/invitations`);
  return await response.json();
}

export async function getInvitation(id) {
  const response = await fetch(`${API_URL}/invitations/${id}`);
  return await response.json();
}

export async function createInvitation(invitation) {
  const response = await fetch(`${API_URL}/invitations`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(invitation),
  });
  return await response.json();
}

export async function editInvitation(id, updatedInvitation) {
  const response = await fetch(`${API_URL}/invitations/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(updatedInvitation),
  });
  return await response.json();
}

export async function deleteInvitation(id) {
  const response = await fetch(`${API_URL}/invitations/${id}`, {
    method: 'DELETE',
  });
  return await response.json();
}



// Users

export async function login(email, password) {
  const response = await fetch(`${API_URL}/login/search`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });
  if (response.ok) {
    return await response.json();
  } else {
    const errorResponse = await response.json();
    throw new Error(errorResponse.message);
  }
}

export async function createUser(user) {
  const response = await fetch(`${API_URL}/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(user),
  });
  return await response.json();
}

export async function updateUser(id, updatedUser) {
  const response = await fetch(`${API_URL}/login/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(updatedUser),
  });
  return await response.json();
}

export async function deleteUser(id) {
  const response = await fetch(`${API_URL}/login/${id}`, {
    method: 'DELETE',
  });
  return await response.json();
}
