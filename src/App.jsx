import React from 'react';
import { Route, Routes } from 'react-router-dom';
import axios from 'axios';
import Header from './components/Header';
import Drawer from './components/Drawer';
import NoMatch from './components/NoMatch';
import AppContext from './context';

import Home from './pages/Home';
import Favorites from './pages/Favorites';
import Orders from './pages/Orders';

function App() {
  const [items, setItems] = React.useState([]);
  const [cartItems, setCartItems] = React.useState([]);
  const [favorites, setFavorites] = React.useState([]);
  const [searchValue, setSearchValue] = React.useState("");
  const [cartOpened, setCartOpened] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    (async () => {
      try {
        const [cartResponse, favoritesResponce, itemsResponce] = await Promise.all([
          axios.get("http://localhost:3001/cart"),
          axios.get("http://localhost:3001/favorites"),
          axios.get("http://localhost:3001/items")
        ])

        setIsLoading(false);
        setCartItems(cartResponse.data);
        setFavorites(favoritesResponce.data);
        setItems(itemsResponce.data);
      } catch (error) {
        alert("Ошибка при запросе данных ;(");
        console.error(error);
      }
    })();
  }, []);

  const onAddToCard = async (obj) => {
    try {
      const findItem = cartItems.find(item => Number(item.parentId) === Number(obj.id));
      if (findItem) {
        setCartItems(prev => prev.filter(item => Number(item.parentId) !== Number(obj.id)));
        await axios.delete(`http://localhost:3001/cart/${findItem.id}`);
      } else {
        setCartItems(prev => [...prev, obj]);
        const { data } = await axios.post("http://localhost:3001/cart", obj);
        setCartItems(prev => prev.map(item => item.parentId === data.parentId ? {...item, id: data.id} : item));
      }
    } catch (error) {
      alert("Ошибка при добавлении в корзину");
      console.error(error);
    }
  };

  const onRemoveItem = async (id) => {
    try {
      await axios.delete(`http://localhost:3001/cart/${id}`);
      setCartItems(prev => prev.filter(item => Number(item.id) !== Number(id)));
    } catch (error) {
      alert("Ошибка при удалении из корзины");
      console.error(error);
    }
  };

  const onAddToFavorite = async (obj) => {
    try {
      if (favorites.find(favObj => favObj.id === obj.id)) {
        await axios.delete(`http://localhost:3001/favorites/${obj.id}`);
        setFavorites(prev => prev.filter(item => Number(item.id) !== Number(obj.id)));
      } else {
        const { data } = await axios.post("http://localhost:3001/favorites", obj);
        setFavorites(prev => [...prev, data]);
      }
    } catch (error) {
      alert("Не удалост добавить в фавориты");
      console.error(error);
    }
  };

  const onChangeSearchInput = (event) => {
    setSearchValue(event.target.value);
  }

  const isItemAdded = (id) => {
    return cartItems.some(obj => Number(obj.parentId) === Number(id));
  };

  return (
    <AppContext.Provider value={{
      cartItems,
      favorites,
      isItemAdded,
      onAddToFavorite,
      onAddToCard,
      setCartOpened,
      setCartItems
    }}>
      <div className="wrapper clear">
        <Drawer
          items={cartItems}
          onClose={() => setCartOpened(false)}
          onRemove={onRemoveItem}
          opened={cartOpened}
        />

        <Header onClickCart={() => setCartOpened(true)} />

        <Routes>
          <Route path="/" element={
            <Home
              items={items}
              cartItems={cartItems}
              searchValue={searchValue}
              setSearchValue={setSearchValue}
              onChangeSearchInput={onChangeSearchInput}
              onAddToFavorite={onAddToFavorite}
              onAddToCard={onAddToCard}
              isLoading={isLoading}
            />
          } />
          <Route path="/favorites" element={
            <Favorites />
          } />
          <Route path="/orders" element={
            <Orders />
          } />
          <Route path="*" element={
            <NoMatch />
          } />
        </Routes>
      </div>
    </AppContext.Provider>
  );
}

export default App;
