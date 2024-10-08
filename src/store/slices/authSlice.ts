import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
} from '@reduxjs/toolkit';
import {AuthService, DriverService} from 'services';

export interface DataI {
  status: boolean;
  statusCode: number;
  message: string;
  id?: string;
  fullName?: string;
  phoneNumber?: string;
  emailAddress?: string;
  password?: string;
}
export interface AuthState {
  loading: boolean;
  message: string;
  showMessage: boolean;
  congratulations: boolean;
  signupData: DataI | null;
  data: DataI | null;
  congratulation: boolean;
  role: string;
  userData: DataI | null;
  customerData: DataI | null;
  supplierData: DataI | null;
  driverData: DataI | null;
  currentUser: DataI | null;
  userLocation: DataI | null;
  updateProfilePictureRes: DataI | null;
  userNextRoute: DataI | null;
  deleteCustomerRes: DataI | null;
  deleteDriverRes: DataI | null;
  deleteSupplierRes: DataI | null;
}

export const initialState: AuthState = {
  loading: false,
  message: '',
  showMessage: false,
  data: null,
  congratulation: false,
  role: 'customer',
  userData: null,
  signupData: null,
  customerData: null,
  congratulations: false,
  supplierData: null,
  driverData: null,
  currentUser: null,
  userLocation: null,
  updateProfilePictureRes: null,
  userNextRoute: null,
  deleteCustomerRes: null,
  deleteDriverRes: null,
  deleteSupplierRes: null,
};

export const login = createAsyncThunk(
  'auth/login',
  async (data, {rejectWithValue}) => {
    try {
      const response = await AuthService.login(data);
      return response;
    } catch (err) {
      return rejectWithValue(err);
    }
  },
);

export const driverLogin = createAsyncThunk(
  'auth/driverLogin',
  async (data: any, {rejectWithValue}) => {
    try {
      const response = await AuthService.driver_login(data);
      return response;
    } catch (err) {
      return rejectWithValue(err);
    }
  },
);

export const driverSignup = createAsyncThunk(
  'auth/driverSignup',
  async (data, {rejectWithValue}) => {
    try {
      const response = await AuthService.driver_signUp(data);
      return response;
    } catch (err) {
      return rejectWithValue(err);
    }
  },
);

export const signUp = createAsyncThunk(
  'auth/signUp',
  async (data, {rejectWithValue}) => {
    try {
      const response = await AuthService.signUp(data);
      return response;
    } catch (err) {
      return rejectWithValue(err);
    }
  },
);

export const supplier_login = createAsyncThunk(
  'auth/supplier_login',
  async (data, {rejectWithValue}) => {
    try {
      const response = await AuthService.supplier_login(data);
      return response;
    } catch (err) {
      console.log('supplier_login', err);
      return rejectWithValue(err);
    }
  },
);

export const supplier_signUp = createAsyncThunk(
  'auth/supplier_signUp',
  async (data, {rejectWithValue}) => {
    try {
      const response = await AuthService.supplier_signUp(data);
      return response;
    } catch (err) {
      return rejectWithValue(err);
    }
  },
);

export const getCustomer = createAsyncThunk(
  'auth/getCustomer',
  async (id, {rejectWithValue}) => {
    try {
      const response = await AuthService.getCustomer(id);
      return response;
    } catch (err) {
      return rejectWithValue(err);
    }
  },
);

export const getCustomerByToken = createAsyncThunk(
  'auth/getCustomerByToken',
  async (_, {rejectWithValue}) => {
    try {
      const response = await AuthService.getCustomerByToken();
      return response;
    } catch (err) {
      return rejectWithValue(err);
    }
  },
);

export const getSupplierByToken = createAsyncThunk(
  'auth/getSupplierByToken',
  async (id, {rejectWithValue}) => {
    try {
      const response = await AuthService.getSupplierByToken();
      console.log('getSupplierByToken err ', response);
      return response;
    } catch (err) {
      console.log('getSupplierByToken err ', err);
      return rejectWithValue(err);
    }
  },
);

export const getDriverByToken = createAsyncThunk(
  'auth/getDriverByToken',
  async (id, {rejectWithValue}) => {
    try {
      const response = await DriverService.driverIdByToken();
      return response;
    } catch (err) {
      return rejectWithValue(err);
    }
  },
);

export const getSupplier = createAsyncThunk(
  'auth/getSupplier',
  async (id, {rejectWithValue}) => {
    try {
      const response = await AuthService.getSupplier(id);
      return response;
    } catch (err) {
      return rejectWithValue(err);
    }
  },
);

export const updateSupplierProfilePicture = createAsyncThunk(
  'auth/updateSupplierProfilePicture',
  async (id, {rejectWithValue}) => {
    try {
      const response = await AuthService.updateSupplierProfilePicture(id);
      return response;
    } catch (err) {
      return rejectWithValue(err);
    }
  },
);

export const updateCustomerProfilePicture = createAsyncThunk(
  'auth/updateCustomerProfilePicture',
  async (id, {rejectWithValue}) => {
    try {
      const response = await AuthService.updateCustomerProfilePicture(id);
      return response;
    } catch (err) {
      return rejectWithValue(err);
    }
  },
);

export const updateDriverProfilePicture = createAsyncThunk(
  'auth/updateDriverProfilePicture',
  async (id, {rejectWithValue}) => {
    try {
      const response = await AuthService.updateDriverProfilePicture(id);
      console.log('auth/updateDriverProfilePicture response', response);
      return response;
    } catch (err) {
      console.log('auth/updateDriverProfilePicture err', err);
      return rejectWithValue(err);
    }
  },
);

export const deleteCustomer = createAsyncThunk(
  'auth/deleteCustomer',
  async (id, {rejectWithValue}) => {
    try {
      const response = await AuthService.deleteCustomer(id);
      return response;
    } catch (err) {
      return rejectWithValue(err);
    }
  },
);

export const deleteSupplier = createAsyncThunk(
  'auth/deleteSupplier',
  async (id, {rejectWithValue}) => {
    try {
      const response = await AuthService.deleteSupplier(id);
      return response;
    } catch (err) {
      return rejectWithValue(err);
    }
  },
);

export const deleteDriver = createAsyncThunk(
  'auth/deleteDriver',
  async (id, {rejectWithValue}) => {
    try {
      const response = await AuthService.deleteDriver(id);
      return response;
    } catch (err) {
      return rejectWithValue(err);
    }
  },
);

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    showLoading: state => {
      state.loading = true;
    },
    congratulationUpdate: state => {
      state.congratulation = true;
    },
    signOut: state => {
      state.congratulation = false;
      state.data = null;
      state.role = 'customer';
    },
    signIn: (state, action) => {
      state.data = action.payload;
    },
    setRole: (state, action) => {
      state.role = action.payload;
    },
    setCongratulationView: (state, action) => {
      state.congratulations = action.payload;
    },
    setCurrentUser: (state, action) => {
      state.currentUser = action.payload;
    },
    setUserLocation: (state, action) => {
      state.userLocation = action.payload;
    },
    setUserNextRoute: (state, action) => {
      state.userNextRoute = action.payload;
    },
  },
  extraReducers: builder => {
    builder.addCase(login.pending, state => {
      state.loading = true;
    });
    builder.addCase(login.fulfilled, (state, action: PayloadAction<any>) => {
      state.loading = false;
      state.data = action.payload;
      state.role = 'customer';
    });
    builder.addCase(login.rejected, (state, action: PayloadAction<any>) => {
      state.message = action.payload;
      state.showMessage = true;
      state.loading = false;
    });
    //driver login
    builder.addCase(driverLogin.pending, state => {
      state.loading = true;
    });
    builder.addCase(
      driverLogin.fulfilled,
      (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.data = action.payload;
        state.role = 'driver';
      },
    );
    builder.addCase(
      driverLogin.rejected,
      (state, action: PayloadAction<any>) => {
        state.message = action.payload;
        state.showMessage = true;
        state.loading = false;
      },
    );
    //driver signup
    builder.addCase(driverSignup.pending, state => {
      state.loading = true;
    });
    builder.addCase(
      driverSignup.fulfilled,
      (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.signupData = action.payload;
      },
    );
    builder.addCase(
      driverSignup.rejected,
      (state, action: PayloadAction<any>) => {
        state.message = action.payload;
        state.showMessage = true;
        state.loading = false;
      },
    );

    builder.addCase(signUp.pending, state => {
      state.loading = true;
    });
    builder.addCase(signUp.fulfilled, (state, action: PayloadAction<any>) => {
      state.loading = false;
      state.signupData = action.payload;
    });
    builder.addCase(signUp.rejected, (state, action: PayloadAction<any>) => {
      state.message = action.payload;
      state.showMessage = true;
      state.loading = false;
    });

    builder.addCase(supplier_login.pending, state => {
      state.loading = true;
    });
    builder.addCase(
      supplier_login.fulfilled,
      (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.data = action.payload;
        state.role = 'supplier';
      },
    );
    builder.addCase(
      supplier_login.rejected,
      (state, action: PayloadAction<any>) => {
        state.message = action.payload;
        state.showMessage = true;
        state.loading = false;
      },
    );
    builder.addCase(supplier_signUp.pending, state => {
      state.loading = true;
    });
    builder.addCase(
      supplier_signUp.fulfilled,
      (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.signupData = action.payload;
      },
    );
    builder.addCase(
      supplier_signUp.rejected,
      (state, action: PayloadAction<any>) => {
        state.message = action.payload;
        state.showMessage = true;
        state.loading = false;
      },
    );

    builder.addCase(getCustomer.pending, state => {
      state.loading = true;
    });
    builder.addCase(
      getCustomer.fulfilled,
      (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.userData = action.payload;
        state.currentUser = action.payload;
      },
    );
    builder.addCase(
      getCustomer.rejected,
      (state, action: PayloadAction<any>) => {
        state.message = action.payload;
        state.showMessage = true;
        state.loading = false;
      },
    );

    builder.addCase(getCustomerByToken.pending, state => {
      state.loading = true;
    });
    builder.addCase(
      getCustomerByToken.fulfilled,
      (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.customerData = action.payload;
        if (action.payload) {
          state.currentUser = action.payload;
        }
      },
    );
    builder.addCase(
      getCustomerByToken.rejected,
      (state, action: PayloadAction<any>) => {
        state.message = action.payload;
        state.showMessage = true;
        state.loading = false;
      },
    );

    builder.addCase(getDriverByToken.pending, state => {
      state.loading = true;
    });
    builder.addCase(
      getDriverByToken.fulfilled,
      (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.driverData = action.payload;
        if (action.payload) {
          state.currentUser = action.payload;
        }
      },
    );
    builder.addCase(
      getDriverByToken.rejected,
      (state, action: PayloadAction<any>) => {
        state.message = action.payload;
        state.showMessage = true;
        state.loading = false;
      },
    );

    //Driver Id by token
    builder.addCase(getSupplierByToken.pending, state => {
      state.loading = true;
    });
    builder.addCase(
      getSupplierByToken.fulfilled,
      (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.supplierData = action.payload;
        if (action.payload) {
          state.currentUser = action.payload;
        }
      },
    );
    builder.addCase(
      getSupplierByToken.rejected,
      (state, action: PayloadAction<any>) => {
        state.message = action.payload;
        state.showMessage = true;
        state.loading = false;
      },
    );

    builder.addCase(getSupplier.pending, state => {
      state.loading = true;
    });
    builder.addCase(
      getSupplier.fulfilled,
      (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.userData = action.payload;
      },
    );
    builder.addCase(
      getSupplier.rejected,
      (state, action: PayloadAction<any>) => {
        state.message = action.payload;
        state.showMessage = true;
        state.loading = false;
      },
    );

    builder.addCase(updateSupplierProfilePicture.pending, state => {
      state.loading = true;
    });
    builder.addCase(
      updateSupplierProfilePicture.fulfilled,
      (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.updateProfilePictureRes = action.payload;
      },
    );
    builder.addCase(
      updateSupplierProfilePicture.rejected,
      (state, action: PayloadAction<any>) => {
        state.message = action.payload;
        state.showMessage = true;
        state.loading = false;
      },
    );

    builder.addCase(updateCustomerProfilePicture.pending, state => {
      state.loading = true;
    });
    builder.addCase(
      updateCustomerProfilePicture.fulfilled,
      (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.updateProfilePictureRes = action.payload;
      },
    );
    builder.addCase(
      updateCustomerProfilePicture.rejected,
      (state, action: PayloadAction<any>) => {
        state.message = action.payload;
        state.showMessage = true;
        state.loading = false;
      },
    );

    builder.addCase(updateDriverProfilePicture.pending, state => {
      state.loading = true;
    });
    builder.addCase(
      updateDriverProfilePicture.fulfilled,
      (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.updateProfilePictureRes = action.payload;
      },
    );
    builder.addCase(
      updateDriverProfilePicture.rejected,
      (state, action: PayloadAction<any>) => {
        state.message = action.payload;
        state.showMessage = true;
        state.loading = false;
      },
    );

    builder.addCase(deleteCustomer.pending, state => {
      state.loading = true;
    });
    builder.addCase(
      deleteCustomer.fulfilled,
      (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.deleteCustomerRes = action.payload;
      },
    );
    builder.addCase(
      deleteCustomer.rejected,
      (state, action: PayloadAction<any>) => {
        state.message = action.payload;
        state.showMessage = true;
        state.loading = false;
      },
    );

    builder.addCase(deleteSupplier.pending, state => {
      state.loading = true;
    });
    builder.addCase(
      deleteSupplier.fulfilled,
      (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.deleteSupplierRes = action.payload;
      },
    );
    builder.addCase(
      deleteSupplier.rejected,
      (state, action: PayloadAction<any>) => {
        state.message = action.payload;
        state.showMessage = true;
        state.loading = false;
      },
    );

    builder.addCase(deleteDriver.pending, state => {
      state.loading = true;
    });
    builder.addCase(
      deleteDriver.fulfilled,
      (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.deleteDriverRes = action.payload;
      },
    );
    builder.addCase(
      deleteDriver.rejected,
      (state, action: PayloadAction<any>) => {
        state.message = action.payload;
        state.showMessage = true;
        state.loading = false;
      },
    );
  },
});

export const {
  showLoading,
  congratulationUpdate,
  setCurrentUser,
  signOut,
  signIn,
  setRole,
  setUserNextRoute,
  setUserLocation,
  setCongratulationView,
} = authSlice.actions;

export default authSlice.reducer;
