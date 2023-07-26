import React from 'react';
import axios from 'axios';

import ModuleInfo from '../ModuleInfo';
import { useCart } from '../../hooks/useCart';

import styles from './Drawer.module.scss';

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function Drawer({ onClose, onRemove, items = [], opened }) {
  const { cartItems, setCartItems, totalPrice } = useCart();
  const [orderId, setOrderId] = React.useState(null);
  const [isOrderComplite, setIsOrderComplite] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);

  const onClickOrder = async () => {
    try {
      setIsLoading(true);
      const { data } = await axios.post("http://localhost:3001/orders", { items: cartItems });
      setOrderId(data.id);
      setIsOrderComplite(true);
      setCartItems([]);

      for (let i = 0; i < cartItems.length; i++) {
        const item = cartItems[i];
        await axios.delete("http://localhost:3001/cart/" + item.id);
        await delay(1000);
      }
    } catch (error) {
      alert("Ошибка при создании заказа :(", error.message);
    }
    setIsLoading(false);
  };
  return (
    <div className={`${styles.overlay} ${opened ? styles.overlayVisible : ""}`}>
      <div className={`${styles.drawer}`}>
        <h2 className="d-flex justify-between mb-30">
          Корзина <img className="cu-p" onClick={onClose} src="img/btn-remove.svg" alt="Close" />
        </h2>

        {
          items.length > 0 ? (
            <div className="d-flex flex-column flex" >
              <div className="items flex">
                {items.map(obj => (
                  <div key={obj.id} className="cartItem d-flex align-center mb-20">
                    <div style={{ backgroundImage: `url(${obj.imageUrl})` }} className="cartItemImg"></div>
                    <div className="mr-20 flex">
                      <p className="mb-5">{obj.title}</p>
                      <b>{obj.price} руб.</b>
                    </div>
                    <img onClick={() => onRemove(obj.id)} className="removeBtn" src="img/btn-remove.svg" alt="Remove" />
                  </div>
                ))}
              </div>
              <div className="cartTotalBlock">
                <ul>
                  <li>
                    <span>Итого:</span>
                    <div></div>
                    <b>{totalPrice} руб.</b>
                  </li>
                  <li>
                    <span>Налог 5%:</span>
                    <div></div>
                    <b>{Math.round(totalPrice * 0.05)} руб.</b>
                  </li>
                </ul>
                <button disabled={isLoading} onClick={onClickOrder} className="greenButton">
                  Оформить заказ <img src="img/arrow.svg" alt="Arrow" />
                </button>
              </div>
            </div>) : (
            <ModuleInfo
              title={isOrderComplite ? "Заказ оформлен!" : "Корзина пустая"}
              description={isOrderComplite ? `Ваш заказ №${orderId} скоро будет передан курьерской доставке` : "Добавьте хотя бы одну пару кроссовок, чтобы сделать заказ"}
              image={isOrderComplite ? "img/complite-order.jpg" : "img/empty-cart.jpg"}
            />
          )}
      </div>
    </div>
  );
}

export default Drawer;