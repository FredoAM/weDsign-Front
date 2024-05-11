const API_URL = 'http://localhost:3001';

export async function getInvitaciones() {
  const response = await fetch(`${API_URL}/invitaciones`);
  return await response.json();
}

export async function getInvitacion(id) {
  const response = await fetch(`${API_URL}/invitaciones/${id}`);
  return await response.json();
}

export async function crearInvitacion(invitacion) {
  const response = await fetch(`${API_URL}/invitaciones`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(invitacion),
  });
  return await response.json();
}

export async function editarInvitacion(id, invitacionActualizada) {
  const response = await fetch(`${API_URL}/invitaciones/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(invitacionActualizada),
  });
  return await response.json();
}

export async function eliminarInvitacion(id) {
  const response = await fetch(`${API_URL}/invitaciones/${id}`, {
    method: 'DELETE',
  });
  return await response.json();
}



// Usuarios

export async function login(correo, contraseña) {
  const response = await fetch(`${API_URL}/login/buscar`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ correo, contraseña }),
  });
  if (response.ok) {
    return await response.json();
  } else {
    const errorResponse = await response.json();
    throw new Error(errorResponse.message);
  }
}

export async function crearUsuario(usuario) {
  const response = await fetch(`${API_URL}/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(usuario),
  });
  return await response.json();
}

export async function actualizarUsuario(id, usuarioActualizado) {
  const response = await fetch(`${API_URL}/login/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(usuarioActualizado),
  });
  return await response.json();
}

export async function eliminarUsuario(id) {
  const response = await fetch(`${API_URL}/login/${id}`, {
    method: 'DELETE',
  });
  return await response.json();
}
