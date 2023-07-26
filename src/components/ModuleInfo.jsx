import React from 'react';
import AppContext from '../context.js';

export default function ModuleInfo({ title, image, description }) {
  const { setCartOpened } = React.useContext(AppContext);
  return (
    <div className="cartEmpty d-flex justify-center align-center flex-column flex">
      <img className="mb-20" width={120} src={image} alt="Empty" />
      <h2>{title}</h2>
      <p className="opacity-6">{description}</p>
      <button onClick={() => setCartOpened(false)} className="greenButton">
        <img src="img/arrow.svg" alt="Arrow" />
        Вернуться назад
      </button>
    </div>
  );
}

