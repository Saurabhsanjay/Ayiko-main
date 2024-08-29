import {createSlice, createAsyncThunk, PayloadAction} from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface CartItem {
  id: string;
  name: string;
  description: string;
  category: string;
  supplierId: string;
  unitPrice: string;
  cartQuantity: number;
  imageUrlList: string[];
  imageUrl: any[];
  createdAt: any;
  updatedAt: any;
  productCategory: any;
  available: boolean;
}

interface CartState {
  items: CartItem[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  differentSupplierError: string | null;
  totalCartQuantity: number;
  totalPrice: number;
}

const initialState: CartState = {
  items: [],
  status: 'idle',
  error: null,
  differentSupplierError: null,
  totalCartQuantity: 0,
  totalPrice: 0,
};

export const fetchCart = createAsyncThunk('cart/fetchCart', async () => {
  const jsonValue = await AsyncStorage.getItem('@cart');
  return jsonValue != null ? JSON.parse(jsonValue) : [];
});

export const saveCart = createAsyncThunk(
  'cart/saveCart',
  async (items: CartItem[]) => {
    const jsonValue = JSON.stringify(items);
    await AsyncStorage.setItem('@cart', jsonValue);
    return items;
  },
);

export const addItemAsync = createAsyncThunk(
  'cart/addItemAsync',
  async (item: CartItem, {getState, rejectWithValue}) => {
    const state = getState() as {cart: CartState};
    const existingSupplierId =
      state.cart.items.length > 0 ? state.cart.items[0].supplierId : null;

    if (existingSupplierId && existingSupplierId !== item.supplierId) {
      return rejectWithValue({
        type: 'DIFFERENT_SUPPLIER',
        message:
          'Your cart contains items from a different supplier. Do you want to clear the cart and add this item?',
      });
    }

    return item;
  },
);

const calculateTotals = (state: CartState) => {
  state.totalCartQuantity = state.items.reduce(
    (total, item) => total + item.cartQuantity,
    0,
  );
  state.totalPrice = state.items.reduce(
    (total, item) => total + parseFloat(item.unitPrice) * item.cartQuantity,
    0,
  );
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addItem: (state, action: PayloadAction<CartItem>) => {
      const existingItemIndex = state.items.findIndex(
        item => item.id === action.payload.id,
      );

      if (existingItemIndex !== -1) {
        state.items[existingItemIndex].cartQuantity +=
          action.payload.cartQuantity;
      } else {
        state.items.push(action.payload);
      }
      calculateTotals(state);
    },
    removeItem: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(item => item.id !== action.payload);
      calculateTotals(state);
    },
    updateCartQuantity: (
      state,
      action: PayloadAction<{id: string; cartQuantity: number}>,
    ) => {
      const {id, cartQuantity} = action.payload;
      const item = state.items.find(item => item.id === id);
      if (item) {
        item.cartQuantity = cartQuantity;
      }
      calculateTotals(state);
    },
    clearCart: state => {
      state.items = [];
      state.totalCartQuantity = 0;
      state.totalPrice = 0;
      state.error = null;
      state.differentSupplierError = null;
    },
    clearDifferentSupplierError: state => {
      state.differentSupplierError = null;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchCart.pending, state => {
        state.status = 'loading';
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
        calculateTotals(state);
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to fetch cart';
      })
      .addCase(saveCart.fulfilled, (state, action) => {
        state.items = action.payload;
        calculateTotals(state);
      })
      .addCase(addItemAsync.fulfilled, (state, action) => {
        const newItem = action.payload;
        const existingItemIndex = state.items.findIndex(
          item => item.id === newItem.id,
        );

        if (existingItemIndex !== -1) {
          state.items[existingItemIndex].cartQuantity += newItem.cartQuantity;
        } else {
          state.items.push(newItem);
        }
        calculateTotals(state);
      })
      .addCase(addItemAsync.rejected, (state, action) => {
        if (
          action.payload &&
          (action.payload as any).type === 'DIFFERENT_SUPPLIER'
        ) {
          state.differentSupplierError = (action.payload as any).message;
        } else {
          state.error = 'Failed to add item to cart';
        }
      });
  },
});

export const {
  addItem,
  removeItem,
  updateCartQuantity,
  clearCart,
  clearDifferentSupplierError,
} = cartSlice.actions;

export default cartSlice.reducer;
