// cartStore.js
import {create} from 'zustand';

const useCartStore = create(set => ({
  items: [],
  addItem: item => set(state => ({items: [...state.items, item]})),
  removeItem: itemId =>
    set(state => ({
      items: state.items.filter(item => item.id !== itemId),
    })),
  clearCart: () => set({items: []}),
  get itemCount() {
    return this.items.length;
  },
}));

export default useCartStore;
