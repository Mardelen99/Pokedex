//let pokemonList = [
   // { name: "Bulbasaur", height: 7, type: ["grass", "poison"] },
   // { name: "Pikachu", height: 4, type: ["electric", "flying"] },
  //  { name: "Squirtle", height: 5, type: ["fire", "ice"] }
//];

const pokemonRepository = (function() {
  let pokemonList = []; 
  let apiURL = 'https://pokeapi.co/api/v2/pokemon/?limit=150';

  
  function getAll() {
      return pokemonList; 
  }


  function add(pokemon) {
      if (typeof pokemon === 'object' && 
          "name" in pokemon &&
          "detailsUrl" in pokemon
      ) {
          pokemonList.push(pokemon); 
      } else {
          console.error('Invalid item: must be an object');
      }
  }

  
  function addListItem(pokemon) {
      let pokemonListElement = document.querySelector('.pokemon-list');  
      let listItem = document.createElement('li');  
      let button = document.createElement('button');  
      button.innerText = pokemon.name; 
      button.classList.add('pokemon-button'); 

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
                      detailsUrl: item.url
                  };
                  add(pokemon);
                  console.log(pokemon);
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
      // Now we add the details to the item
      item.imageUrl = details.sprites.front_default;
      item.height = details.height;
      item.types = details.types;
    }).catch(function (e) {
      console.error(e);
    });
  }
  
  function showDetails(pokemon) {
     loadDetails(pokemon).then(function () {
      console.log(pokemon);
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
