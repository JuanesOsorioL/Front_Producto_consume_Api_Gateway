// Ruta base relativa al Gateway
//const API_BASE = 'http://localhost:8080/api/productos';
//const API_BASE = 'http://localhost:8282';
const API_BASE = 'http://localhost:8282/api/productos';
//const API_BASE ='http://localhost:8282/default';
// Selector rápido
const $ = sel => document.querySelector(sel);


async function fetchProductos() {
    try {
      const res = await fetch(API_BASE, { method: 'GET' });
      console.log(res);
      if (res.status === 403) throw new Error('Acceso denegado (403)');
      if (!res.ok)      throw new Error(`HTTP ${res.status}`);
      const productos = await res.json();
      console.log(productos);
    } catch (err) {
      console.error('Error al obtener productos:', err);
    }
  }
  
  window.addEventListener('DOMContentLoaded', fetchProductos);

