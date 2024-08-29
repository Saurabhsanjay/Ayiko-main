import {useState, useCallback} from 'react';
import {getItemQuantity, setCarItem} from 'store/slices/CartSlice';

export const useCartOperations = () => {
  const [quantity, setQuantity] = useState(0);

  const addToCart = useCallback(
    async (item: any) => {
      await setCarItem(item, 'add', quantity, setQuantity);
    },
    [quantity],
  );

  const removeFromCart = useCallback(
    async (item: any) => {
      await setCarItem(item, 'remove', quantity, setQuantity);
    },
    [quantity],
  );

  const updateItemQuantity = useCallback(async (item: any) => {
    await getItemQuantity(item, setQuantity);
  }, []);

  return {
    quantity,
    addToCart,
    removeFromCart,
    updateItemQuantity,
  };
};
