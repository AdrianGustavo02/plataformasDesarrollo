import React, { useState, useEffect } from 'react'; 
import AddGames from './AddGames';

const GameList = ({
  games,
  addToWishlist,
  removeFromWishlist,
  onGameClick,
  currentUser,
  removeGameFromStore,
  purchaseCart,
  cart = [],
  setCart,
  library = [],
  setLibrary,
  wishlist = [],
}) => {
  const [storedUser, setCurrentUser] = useState([]);
  const [localGames, setLocalGames] = useState([]);
  const [removedGames, setRemovedGames] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [gameToRemove, setGameToRemove] = useState(null);
  const [showCart, setShowCart] = useState(false);
  const [showLibrary, setShowLibrary] = useState(false);
 
  const [currentView, setCurrentView] = useState('list');

useEffect(() => {
  const storedLocalGames = JSON.parse(localStorage.getItem('localGames'));

  if (!storedLocalGames || storedLocalGames.length === 0) {
 
    const fetchedGames = games;
    localStorage.setItem('localGames', JSON.stringify(fetchedGames));
    setLocalGames(fetchedGames);
  } else {
    setLocalGames(storedLocalGames);
  }
}, [games]); 


  
useEffect(() => {
  if (currentUser) {
    const storedLibrary = JSON.parse(localStorage.getItem(`library_${currentUser.username}`)) || [];
    setLibrary(storedLibrary);
  }
}, [currentUser]);
  

 
  const closeModal = () => {
    setIsModalOpen(false);
    setGameToRemove(null);
  };

  const confirmDelete = () => {
    if (gameToRemove) {
      
      const updatedLocalGames = localGames.filter((game) => game.id !== gameToRemove.id);
      setLocalGames(updatedLocalGames); 
      localStorage.setItem('localGames', JSON.stringify(updatedLocalGames)); 
  
      
      const updatedRemovedGames = [...removedGames, gameToRemove];
      setRemovedGames(updatedRemovedGames); 
      localStorage.setItem('removedGames', JSON.stringify(updatedRemovedGames)); 
  
     
      closeModal();
    }
  };

 
  const filteredGames = localGames.filter(
    (game) => !removedGames.some((removed) => removed.id === game.id)
  );
  

  const addToCart = (game) => {
    if (currentUser?.role === "admin") {
      alert("El administrador no puede agregar juegos al carrito.");
      return;
    }
  
    if (!cart.some((g) => g.id === game.id)) {
      const updatedCart = [...cart, { ...game }];
      setCart(updatedCart);
  
      //guardamos en el localstorage
      localStorage.setItem(
        `cart_${currentUser.username}`,
        JSON.stringify(updatedCart)
      );
      alert("El juego se agregó al carrito.");
    } else {
      alert("Este juego ya está en el carrito.");
    }
  };
  
  const removeFromCart = (game) => {
    const updatedCart = cart.filter((item) => item.id !== game.id);
    setCart(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(`cart_${currentUser.username}`, JSON.stringify(cart));
    }
  }, [cart, currentUser]);


const acquireGame = (game) => {
  alert(`Juego "${game.name}" adquirido con éxito`);
  
  const updatedLibrary = [...library, game];
  setLibrary(updatedLibrary);

  const updatedCart = cart.filter((g) => g.id !== game.id);
  setCart(updatedCart);

  localStorage.setItem(`library_${currentUser.username}`, JSON.stringify(updatedLibrary));
  localStorage.setItem(`cart_${currentUser.username}`, JSON.stringify(updatedCart));
};
 
 const handleAddGame = (game) => {
  const isGameInList = localGames.some(existingGame => existingGame.id === game.id);
  if (!isGameInList) {
    const updatedGames = [...localGames, game];
    setLocalGames(updatedGames);
    localStorage.setItem('localGames', JSON.stringify(updatedGames)); 
    alert('Juego agregado correctamente');
  } else {
    alert('El juego ya está en tu lista.');
  }
};

const addToWishlistWithAlert = (game) => {
  if (library?.some((libGame) => libGame.id === game.id)) {
    alert("Este juego ya está en tu biblioteca, no puedes agregarlo a deseados.");
  } else if (currentUser.wishlist?.some((wishGame) => wishGame.id === game.id)) {
    alert("Este juego ya está en tu lista de deseados.");
  } else {
    addToWishlist(game);
    alert("Se agregó a la lista de deseados correctamente.");
  }
};

  const removeFromWishlistWithAlert = (game) => {
    removeFromWishlist(game);
    alert("Se eliminó de la lista de deseados");
  };

  return (
    <div className="bg-gray-900 min-h-screen text-white p-8">
    {currentView === 'add' ? (
      <AddGames
        games={games}
        removedGames={removedGames}
        onAddGame={handleAddGame}  
        goBack={() => setCurrentView('list')} 
      />
    ) : (
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-semibold text-center text-gray-100">
          {showCart ? 'Carrito' : showLibrary ? 'Biblioteca' : 'Lista de Juegos'}
        </h2>
        <div className="flex gap-4">
        {currentUser?.role === 'admin' && (
          <button
            onClick={() => setCurrentView('add')}
            className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded transition-colors duration-200">
            Agregar Juegos
          </button>
        )}
          <button
            onClick={() => {
              setShowCart(false);
              setShowLibrary(false);

            }}
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition-colors duration-200"
          >
            Lista de Juegos
          </button>
          <button
            onClick={() => {
              setShowCart(true);
              setShowLibrary(false);
            }}
            className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded transition-colors duration-200"
          >
            Ver Carrito
          </button>
          <button
            onClick={() => {
              setShowCart(false);
              setShowLibrary(true);
      }}
            className="bg-purple-500 hover:bg-purple-600 text-white font-bold py-2 px-4 rounded transition-colors duration-200"
          >
            Biblioteca
          </button>
        </div>
      </div>
    )}
      
          {currentView === "list" && (
  <div>
    {/* Mostrar Carrito */}
    {showCart && (
      <div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {cart.length > 0 ? (
            cart.map((game) => (
              <div
                key={game.id}
                className="bg-gray-800 rounded-lg shadow-lg overflow-hidden hover:shadow-2xl transition-shadow duration-300"
              >
                <img
                  src={game.background_image}
                  alt={game.name}
                  className="w-full h-48 object-contain"
                />
                <div className="p-4 space-y-2">
                  <h3 className="text-xl font-semibold truncate">{game.name}</h3>
                  <p className="text-sm text-gray-300">
                    <strong>Géneros:</strong> {game.genres?.map((genre) => genre.name).join(", ")}
                  </p>
                  <div className="flex justify-between mt-4">
                    <button
                      onClick={() => removeFromCart(game)}
                      className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded transition-colors duration-200"
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-400">Tu carrito está vacío.</p>
          )}
        </div>
        {cart.length > 0 && (
          <div className="text-center mt-6">
            <button
              onClick={purchaseCart} // Llama a la función pasada desde App.jsx
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded transition-colors duration-200"
            >
              Comprar Juegos
            </button>
          </div>
        )}
      </div>
    )}

    {/* Mostrar Biblioteca */}
    {showLibrary && (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {library.length > 0 ? (
          library.map((game) => (
            <div
              key={game.id}
              className="bg-gray-800 rounded-lg shadow-lg overflow-hidden hover:shadow-2xl transition-shadow duration-300"
            >
              <img
                src={game.background_image}
                alt={game.name}
                className="w-full h-48 object-contain"
              />
              <div className="p-4 space-y-2">
                <h3 className="text-xl font-semibold truncate">{game.name}</h3>
                <p className="text-sm text-gray-300">
                  <strong>Géneros:</strong> {game.genres?.map((genre) => genre.name).join(", ")}
                </p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-400">Tu biblioteca está vacía.</p>
        )}
      </div>
    )}

    {/* Mostrar Lista de Juegos */}
    {!showCart && !showLibrary && (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {localGames.length > 0 ? (
          localGames.map((game) => (
            <div
              key={game.id}
              className="bg-gray-800 rounded-lg shadow-lg overflow-hidden hover:shadow-2xl transition-shadow duration-300"
            >
              <div className="relative">
                {game.background_image && (
                  <img
                    src={game.background_image}
                    alt={game.name}
                    className="w-full h-48 object-contain"
                  />
                )}
                <div className="absolute bottom-0 w-full bg-gradient-to-t from-black to-transparent text-white p-4">
                  <h3
                    className="text-xl font-semibold truncate cursor-pointer"
                    onClick={() => onGameClick(game)}
                  >
                    {game.name}
                  </h3>
                </div>
              </div>
              <div className="p-4 space-y-2">
                <p className="text-sm text-gray-300">
                  <strong>Géneros:</strong> {game.genres?.map((genre) => genre.name).join(", ")}
                </p>
                <p className="text-sm text-gray-300">
                  <strong>Plataformas:</strong>{" "}
                  {game.platforms?.map((platform) => platform.platform.name).join(", ")}
                </p>
                <div className="flex flex-col gap-2 mt-4">
                  <button
                    onClick={() => addToWishlistWithAlert(game)}
                    className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition-colors duration-200"
                  >
                    Agregar a deseados
                  </button>
                  <button
                    onClick={() => addToCart(game)}
                    className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded transition-colors duration-200"
                  >
                    Agregar al Carrito
                  </button>
                  {currentUser?.role === "admin" && (
                    <button
                      onClick={() => {
                        setGameToRemove(game);
                        setIsModalOpen(true);
                      }}
                      className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded transition-colors duration-200"
                    >
                      Eliminar
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-400">No hay juegos disponibles.</p>
        )}
      </div>
    )}
  </div>
)}

    {currentView === 'list' && isModalOpen && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
        <div className="bg-white p-6 rounded-lg shadow-lg w-96">
          <h3 className="text-xl font-semibold mb-4 text-gray-900">Confirmar Eliminación</h3> 
          <p className="text-gray-700">¿Estás seguro de que deseas eliminar este juego?</p>
          <div className="flex justify-between mt-4">
            <button
              onClick={confirmDelete}
              className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded transition-colors duration-200"
            >
              Confirmar
            </button>
            <button
              onClick={closeModal}
              className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded transition-colors duration-200"
            >
              Cancelar
            </button>
          </div>
        </div>
      </div>
    )}
          </div>
        
  );
};

export default GameList;