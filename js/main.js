// -------- Funcion para crear las cards --------

function createRecipeCard(receta) {

  // Card para la receta
  const card = document.createElement('div');
  card.classList.add('card', 'mb-3');

  // Imagen para la card
  const recipeImage = document.createElement('img');
  recipeImage.classList.add('card-img-top');
  recipeImage.src = receta.strMealThumb;
  recipeImage.alt = receta.strMeal;

  // Contenedor y cuerpo de la card
  const cardBody = document.createElement('div');
  cardBody.classList.add('card-body');

  // Creamos elementos HTML para mostrar la info de la receta
  const recipeTitle = document.createElement('h2');
  recipeTitle.classList.add('card-title');
  recipeTitle.textContent = receta.strMeal;

  const recipeInstructions = document.createElement('p');
  recipeInstructions.classList.add('card-text');
  recipeInstructions.textContent = receta.strInstructions;

// Botón de para la lista de favoritos
  let esFavorito = false;
  const favoritosButton = document.createElement('button');
  favoritosButton.textContent = 'Favoritos';
  favoritosButton.classList.add('btn', 'btn-secondary', 'favorites-button');

   // Función para manejar clics en el botón
   function toggleFavorite() {
    // Cambia el estado del boton
    esFavorito = !esFavorito;

    // Se actualiza la apariencia del boton segun el estado
    if (esFavorito) {
      favoritosButton.classList.add('active');
    } else {
      favoritosButton.classList.remove('active');
    }
  }

  // Evento de clic al botón de Favoritos
  favoritosButton.addEventListener('click', () => {
    toggleFavorite();
    agregarRecetaAFavoritos(receta);
  });

  // Agregamos los elementos a la card
  card.appendChild(recipeImage);
  cardBody.appendChild(recipeTitle);
  cardBody.appendChild(recipeInstructions);
  cardBody.appendChild(favoritosButton);
  card.appendChild(cardBody);

  return card; // Retornamos la card creada
}

const recetasFavoritas = []; // Array para almacenar las recetas favoritas que agrega el usuario

// Función para agregar la receta a la lista de Favoritos
function agregarRecetaAFavoritos(receta) {
  recetasFavoritas.push(receta); // Agrega la receta al array de la lista de favoritos
  console.log('Receta agregada a Favoritos:', receta);
  localStorage.setItem('recetasFavoritas', JSON.stringify(recetasFavoritas));
  mostrarNotificacion();
}

// Función para mostrar la notificación de que se agregó la receta a favoritos
function mostrarNotificacion() {
  const notificacion = document.getElementById('notification');
  notificacion.style.opacity = '1';

  // Obtener las recetas favoritas del Local Storage
  const recetasFavoritas = JSON.parse(localStorage.getItem('recetasFavoritas')) || [];

  // Contenedor para mostrar las recetas favoritas
  const favoritosContainer = document.getElementById('favoritos-container');
  favoritosContainer.innerHTML = ''; // Limpia el contenido anterior

  // Crear el contenedor de tarjetas
  const cardContainer = document.createElement('div');
  cardContainer.classList.add('card-container');

  // Recorremos las recetas favoritas y creamos una tarjeta para cada una
  recetasFavoritas.forEach((receta) => {
  
    const card = document.createElement('div');
    card.classList.add('card', 'mb-3', 'small-card', 'favorita');

    // Imagen de la receta
    const recipeImage = document.createElement('img');
    recipeImage.classList.add('card-img-top');
    recipeImage.src = receta.strMealThumb;
    recipeImage.alt = receta.strMeal;

    // Agregamos icono de corazón para la card favorito
    const heartIcon = document.createElement('i');
    heartIcon.classList.add('fas', 'fa-heart', 'heart-icon');

    // Card Body
    const cardBody = document.createElement('div');
    cardBody.classList.add('card-body');

    // Título de la receta
    const title = document.createElement('h4');
    title.classList.add('card-title');
    title.textContent = receta.strMeal;

    cardBody.appendChild(heartIcon);
    cardBody.appendChild(title);
    card.appendChild(recipeImage);
    card.appendChild(cardBody);
    cardContainer.appendChild(card);
  });

  // Agregar el contenedor de tarjetas al contenedor principal
  favoritosContainer.appendChild(cardContainer);

  // Ocultar la notificación despues de 3 segundos
  setTimeout(() => {
    notificacion.style.opacity = '0';
  }, 3000);
}

document.addEventListener('DOMContentLoaded', () => {
  
    const inputField = document.getElementById('input');
    const recetasContainer = document.querySelector('.recetas');
    const categoryButtonsContainer = document.querySelector('.category-buttons');
    const recetaDetallesContainer = document.getElementById('recetaDetalle');
   // Contenedor donde se mostrarán las recetas
    const recetasAleatorias = document.querySelector('.recetas');
    const apiUrl = 'https://www.themealdb.com/api/json/v1/1/random.php';
  
    // Realizamos una solicitud a la API ramdon para obtener seis recetas aleatorias
    for (let i = 0; i < 6; i++) {
      fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
          if (data.meals && data.meals.length > 0) {
            const receta = data.meals[0];
            // Llamamos a la función createRecipeCard para crear una card de la receta
          const card = createRecipeCard(receta);
          // Agrega la card al contenedor de recetas
          recetasContainer.appendChild(card);
        }
      })
  }
  
/* --------- BUSCADOR DE RECETA ---------- */

// Evento para detectar al usuario cuando presiona la tecla enter   
inputField.addEventListener('keydown', event => {
  // Verificamos si la tecla presionada es "Enter"
  if (event.key === 'Enter') { 
    const searchTerm = inputField.value.trim(); // Elimina los espacios en blanco al principio y al final del termino de la busqueda

    // Nos fijamos que el término de búsqueda no este vacio
    if (searchTerm !== '') {
  
      const apiUrl = `https://www.themealdb.com/api/json/v1/1/search.php?s=${searchTerm}`;

// Realizamos una solicitud a la API
      fetch(apiUrl)
        .then(response => response.json()) //Se procesa la respuesta como json
        .then(data => {

/* Imprimimos las cards de la receta buscada */
          const recetas = data.meals; // Datos de recetas de la propiedad "meals" del objeto "data"

          recetasContainer.innerHTML = ''; // Limpiamos el contenedor antes de agregar nuevas cards

          if (recetas && recetas.length > 0) {
            // Verificamos si hay recetas válidas y se muestran los resultados
            recetas.forEach(receta => {
              // Llama a la función createRecipeCard para crear la card receta
              const card = createRecipeCard(receta);
              // Agrega la card al contenedor de recetas
              recetasContainer.appendChild(card);
            });
          } else {
            // Si no se encuentran recetas validas, se muestra un mensaje de error
            const errorContainer = document.createElement('div');
            errorContainer.classList.add('alert', 'alert-danger');
            errorContainer.textContent = 'No se encontraron recetas para la búsqueda especificada.';
            recetasContainer.appendChild(errorContainer);
          }
        })
        .catch(error => {
          console.error('Error en la solicitud de búsqueda:', error);
        });
    }
  }
});

/* ------------ Obtenemos los datos de la API de categorías de TheMealDB ------------ */

fetch('https://www.themealdb.com/api/json/v1/1/categories.php')
  .then(response => response.json())
  .then(data => {
    const categories = data.categories;

    categories.forEach(category => {
      const button = document.createElement('button');
      button.textContent = category.strCategory;
      button.classList.add('btn', 'btn-primary');

      // Agregamos el evento de clic para mostrar recetas de la categoria
      button.addEventListener('click', () => {
        // Llamamos a una función para cargar las recetas de la categoría
        cargarRecetasPorCategoria(category.strCategory);
      });
      categoryButtonsContainer.appendChild(button);
    });
  })


// -------- Función para cargar recetas de una categoría específica -----------

function cargarRecetasPorCategoria(categoria) {

  // Realizamos una solicitud a la API para obtener recetas de la categoría seleccionada
  const apiUrl = `https://www.themealdb.com/api/json/v1/1/filter.php?c=${categoria}`;

  fetch(apiUrl)
    .then(response => response.json())
    .then(data => {
      // Limpiamos el contenedor de recetas y el de detalles
      recetasContainer.innerHTML = '';
      recetaDetallesContainer.innerHTML = '';

      // Se verifica si se encuentran recetas
      if (data.meals) {
        // Itera sobre las recetas y crea las cards
        data.meals.forEach(receta => {
          const card = document.createElement('div');
          card.classList.add('card');

          const recipeImage = document.createElement('img');
          recipeImage.classList.add('card-img');
          recipeImage.src = receta.strMealThumb;
          recipeImage.alt = receta.strMeal;

          const cardBody = document.createElement('div');
          cardBody.classList.add('card-body');

          const recipeName = document.createElement('h3');
          recipeName.classList.add('card-title', 'title-detalle');
          recipeName.textContent = receta.strMeal;

          // Agregamos el botón para ver más detalles
  const detailsButton = document.createElement('button');
  detailsButton.textContent = 'Ver Receta';
  detailsButton.classList.add('btn', 'btn-primary', 'details-button');

  // Evento de clic al botón para mostrar detalles
  detailsButton.addEventListener('click', () => {
    mostrarDetallesReceta(receta.idMeal);
  });
          card.appendChild(recipeImage);
          cardBody.appendChild(recipeName);
          cardBody.appendChild(detailsButton);
          card.appendChild(cardBody);
          recetasContainer.appendChild(card);
        });
      } 
    })
  }

// -------- Función para mostrar los detalles de una receta por su ID -------
function mostrarDetallesReceta(recipeId) {
   recetasContainer.innerHTML = '';

  // Se realiza otra solicitud a la API para obtener detalles de la receta por su ID
  const apiUrl = `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${recipeId}`;

  fetch(apiUrl)
    .then(response => response.json())
    .then(data => {
      recetaDetallesContainer.innerHTML = '';

      // Verifica si se encontraron detalles de recetas
      if (data.meals) {
        const receta = data.meals[0];

        // Crea elementos HTML para mostrar los detalles de la receta
        const recipeDetails = document.createElement('div');
        recipeDetails.classList.add('card', 'mb-3', 'detallesReceta');
        recipeDetails.style.maxWidth = '600px';

        const recipeBody = document.createElement('div');
        recipeBody.classList.add('card-body');

        const recipeTitle = document.createElement('h4');
        recipeTitle.textContent = receta.strMeal;
        recipeTitle.classList.add('card-title');

        const recipeImage = document.createElement('img');
        recipeImage.src = receta.strMealThumb;
        recipeImage.alt = receta.strMeal;
        recipeImage.classList.add('card-img-top');

        const recipeInstructions = document.createElement('p');
        recipeInstructions.textContent = receta.strInstructions;
        recipeInstructions.classList.add('card-text');
        
        recipeDetails.appendChild(recipeTitle);
        recipeDetails.appendChild(recipeImage);
        recipeDetails.appendChild(recipeInstructions);
        recetaDetallesContainer.appendChild(recipeDetails);
      }
    })
}
});



  
  