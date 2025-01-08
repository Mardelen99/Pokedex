const pokemonRepository = (function() {
  let pokemonList = []; 
  let apiURL = 'https://pokeapi.co/api/v2/pokemon/?limit=150';

  function getAll() {
      return pokemonList; 
  }

  function add(pokemon) {
      if (typeof pokemon === 'object' && "name" in pokemon && "detailsUrl" in pokemon) {
          pokemonList.push(pokemon); 
      } else {
          console.error('Invalid item: must be an object');
      }
  }

  function addListItem(pokemon) {
      let pokemonListElement = document.querySelector('.pokemon-list');  
      let listItem = document.createElement('li');
      listItem.classList.add('list-group-item');  // Bootstrap class added here
      let button = document.createElement('button');  
      button.innerText = pokemon.name; 
      button.classList.add('btn', 'btn-primary', 'btn-block'); // Button styling with Bootstrap

      button.setAttribute('data-toggle', 'modal');
      button.setAttribute('data-target', '#pokemon-modal');

      button.addEventListener('click', function() {
          showDetails(pokemon);  
      });

      listItem.appendChild(button);
      pokemonListElement.appendChild(listItem);
  }

  function loadList() {
      return fetch(apiURL)
          .then(function (response) {
              return response.json();
          })
          .then(function (json) {
              json.results.forEach(function (item) {
                  let pokemon = {
                      name: item.name,
                      detailsUrl: item.url,
                  };
                  add(pokemon);
              });
          })
          .catch(function (e) {
              console.error(e);
          });
  }

  function loadDetails(item) {
    let url = item.detailsUrl;
    return fetch(url).then(function (response) {
      return response.json();
    }).then(function (details) {
      item.imageUrl = details.sprites.front_default;
      item.height = details.height;
      item.types = details.types.map(type => type.type.name);
    }).catch(function (e) {
      console.error(e);
    });
  }

  function showDetails(pokemon) {
     loadDetails(pokemon).then(function () {
      let modalName = document.querySelector('.pokemon-name');
      let modalImage = document.querySelector('.pokemon-image');
      let modalHeight = document.querySelector('.pokemon-height');
      let modalTypes = document.querySelector('.pokemon-types');

      modalName.textContent = pokemon.name;
      modalImage.src = pokemon.imageUrl;
      modalHeight.textContent = `Height: ${(pokemon.height / 10).toFixed(2)} m`;
      modalTypes.textContent = `Types: ${pokemon.types.join(', ')}`;
    });
  }

  return {
      getAll: getAll,
      add: add,
      addListItem: addListItem,
      loadList: loadList,
      loadDetails: loadDetails,
      showDetails: showDetails
  };
})();

pokemonRepository.loadList().then(function() {
  pokemonRepository.getAll().forEach(function(pokemon) {
      pokemonRepository.addListItem(pokemon);  
  });
});

