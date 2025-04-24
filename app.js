
const API_BASE = 'http://localhost:9091/api/productos';

/*
async function  fetchProductos() {
    fetch("http://localhost:9091/api/productos")
    .then(async res => {
      if (!res.ok) {
        const body = await res.text();  // ← muestra el cuerpo aunque sea texto o vacío
        console.warn("Error response body:", body);
        throw new Error(`HTTP ${res.status}`);
      }
      return res.json();  // sólo si el cuerpo está bien
    })
    .then(data => console.log("Data:", data))
    .catch(err => console.error("Fetch error:", err));
  }
*/


async function fetchProductos() {
    fetch(API_BASE)
      .then(async res => {
        const body = await res.json();
        if (body.status=503) {
            const texto = document.getElementById('conexion');
            texto.innerHTML = '';
            const span = document.createElement('span');
            span.textContent=body.mensaje;
            texto.appendChild(span);
        }
        return body;
      })
      .then(data => {
        const list = document.getElementById('productos-list');
        list.innerHTML = '';
        data.body.forEach(p => {
          const li = document.createElement('li');
          li.textContent = `${p.id}: ${p.nombre} — $${p.precio}`;
          list.appendChild(li);
        });
      })
      .catch(err => {
        console.error("Fetch error:", err);
      });
  }
  

//crear
  document.getElementById('form-crear').addEventListener('submit', async e => {
    e.preventDefault();
    const nombre = document.getElementById('crear-nombre').value;
    const precio = parseFloat(document.getElementById('crear-precio').value);
  
    fetch(API_BASE, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nombre, precio })
    })
      .then(async res => {
        const body = await res.json();
        if (body.status=503) {
            const texto = document.getElementById('conexion');
            texto.innerHTML = '';
            const span = document.createElement('span');
            span.textContent=body.mensaje;
            texto.appendChild(span);
        }
        return body;
      })
      .then(() => {
        e.target.reset();
        fetchProductos();
      })
      .catch(err => {
        console.error("Fetch error:", err);
      });
  });


//buscar por id
  document.getElementById('form-buscar').addEventListener('submit', async e => {
    e.preventDefault();
    const id = document.getElementById('buscar-id').value;
  
    fetch(`${API_BASE}/producto?id=${id}`)
      .then(async res => {
        const body = await res.json();
        if (body.status==503) {
            const texto = document.getElementById('conexion');
            texto.innerHTML = '';
            const span = document.createElement('span');
            span.textContent=body.mensaje;
            texto.appendChild(span);
            document.getElementById('buscar-id').value="";
        }
        if (body.status==404) {
            const texto = document.getElementById('existe');
            texto.innerHTML = '';
            const span = document.createElement('span');
            span.textContent=body.mensaje;
            texto.appendChild(span);
            document.getElementById('producto-detalle').style.display = 'none';
        }
        return body;
      })
      .then(data => {
        const p = data.body;
        document.getElementById('detalle-nombre').value = p.nombre;
        document.getElementById('detalle-precio').value = p.precio;
        document.getElementById('producto-detalle').style.display = 'block';
        document.getElementById('btn-actualizar').dataset.id = id;
        document.getElementById('btn-eliminar').dataset.id = id;
        const texto = document.getElementById('existe');
            texto.innerHTML = '';
      })
      .catch(err => {
        console.error("Fetch error:", err);
      });
  });
  

//actualizar
document.getElementById('btn-actualizar').addEventListener('click', async e => {
    const id = e.target.dataset.id;
    const nombre = document.getElementById('detalle-nombre').value;
    const precio = parseFloat(document.getElementById('detalle-precio').value);
  
    fetch(`${API_BASE}?id=${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nombre, precio })
    })
      .then(async res => {
        const body = await res.json();
        if (body.status==503) {
            const texto = document.getElementById('conexion');
            texto.innerHTML = '';
            const span = document.createElement('span');
            span.textContent=body.mensaje;
            texto.appendChild(span);
        }
        if (body.status==404) {
            const texto = document.getElementById('existe');
            texto.innerHTML = '';
            const span = document.createElement('span');
            span.textContent=body.mensaje;
            texto.appendChild(span);

            document.getElementById('producto-detalle').style.display = 'none';
        }
        return body;
      })
      .then(() => {
        document.getElementById('buscar-id').value="";
        document.getElementById('producto-detalle').style.display = 'none';
        alert('Producto actualizado');
        fetchProductos();
      })
      .catch(err => {
        console.error("Fetch error:", err);
      });
  });



//eliminar
document.getElementById('btn-eliminar').addEventListener('click', async e => {
    const id = e.target.dataset.id;
  
    fetch(`${API_BASE}?id=${id}`, {
      method: 'DELETE'
    })
      .then(async res => {
        const body = await res.json();
        if (body.status==503) {
            const texto = document.getElementById('conexion');
            texto.innerHTML = '';
            const span = document.createElement('span');
            span.textContent=body.mensaje;
            texto.appendChild(span);
        }
        if (body.status==404) {
            const texto = document.getElementById('existe');
            texto.innerHTML = '';
            const span = document.createElement('span');
            span.textContent=body.mensaje;
            texto.appendChild(span);

            document.getElementById('producto-detalle').style.display = 'none';
        }
        return body;
      })
      .then(() => {
        document.getElementById('buscar-id').value="";
        alert('Producto eliminado');
        document.getElementById('producto-detalle').style.display = 'none';
        fetchProductos();
      })
      .catch(err => {
        console.error("Fetch error:", err);
      });
  });



  fetchProductos();




  const $ = id => document.getElementById(id);


// Refrescar lista
$('btn-refresh').addEventListener('click', fetchProductos);

// Al cargar página
window.addEventListener('DOMContentLoaded', fetchProductos);