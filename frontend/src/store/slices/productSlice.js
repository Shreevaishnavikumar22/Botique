import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import productAPI from '../../services/productAPI';

// Async thunks
export const getProducts = createAsyncThunk(
  'products/getProducts',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await productAPI.getProducts(params);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch products');
    }
  }
);

export const getProduct = createAsyncThunk(
  'products/getProduct',
  async (productId, { rejectWithValue }) => {
    try {
      const response = await productAPI.getProduct(productId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch product');
    }
  }
);

export const getFeaturedProducts = createAsyncThunk(
  'products/getFeaturedProducts',
  async (_, { rejectWithValue }) => {
    try {
      const response = await productAPI.getFeaturedProducts();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch featured products');
    }
  }
);

export const getTopRatedProducts = createAsyncThunk(
  'products/getTopRatedProducts',
  async (_, { rejectWithValue }) => {
    try {
      const response = await productAPI.getTopRatedProducts();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch top rated products');
    }
  }
);

export const getNewArrivals = createAsyncThunk(
  'products/getNewArrivals',
  async (_, { rejectWithValue }) => {
    try {
      const response = await productAPI.getNewArrivals();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch new arrivals');
    }
  }
);

export const getCategories = createAsyncThunk(
  'products/getCategories',
  async (_, { rejectWithValue }) => {
    try {
      const response = await productAPI.getCategories();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch categories');
    }
  }
);

export const getBrands = createAsyncThunk(
  'products/getBrands',
  async (_, { rejectWithValue }) => {
    try {
      const response = await productAPI.getBrands();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch brands');
    }
  }
);

const initialState = {
  products: [],
  featuredProducts: [],
  topRatedProducts: [],
  newArrivals: [],
  categories: [],
  brands: [],
  currentProduct: null,
  relatedProducts: [],
  filters: {
    keyword: '',
    category: '',
    brand: '',
    minPrice: '',
    maxPrice: '',
    minRating: '',
    sortBy: 'createdAt',
    sortOrder: 'desc',
  },
  pagination: {
    currentPage: 1,
    totalPages: 1,
    hasNextPage: false,
    hasPrevPage: false,
    total: 0,
  },
  isLoading: false,
  error: null,
};

const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = {
        keyword: '',
        category: '',
        brand: '',
        minPrice: '',
        maxPrice: '',
        minRating: '',
        sortBy: 'createdAt',
        sortOrder: 'desc',
      };
    },
    setCurrentPage: (state, action) => {
      state.pagination.currentPage = action.payload;
    },
    clearProductError: (state) => {
      state.error = null;
    },
    clearCurrentProduct: (state) => {
      state.currentProduct = null;
      state.relatedProducts = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // Get Products
      .addCase(getProducts.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.products = action.payload.products;
        state.pagination = action.payload.pagination;
        state.error = null;
      })
      .addCase(getProducts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Get Product
      .addCase(getProduct.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getProduct.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentProduct = action.payload.product;
        state.relatedProducts = action.payload.relatedProducts;
        state.error = null;
      })
      .addCase(getProduct.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Get Featured Products
      .addCase(getFeaturedProducts.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getFeaturedProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.featuredProducts = action.payload.products;
        state.error = null;
      })
      .addCase(getFeaturedProducts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Get Top Rated Products
      .addCase(getTopRatedProducts.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getTopRatedProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.topRatedProducts = action.payload.products;
        state.error = null;
      })
      .addCase(getTopRatedProducts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Get New Arrivals
      .addCase(getNewArrivals.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getNewArrivals.fulfilled, (state, action) => {
        state.isLoading = false;
        state.newArrivals = action.payload.products;
        state.error = null;
      })
      .addCase(getNewArrivals.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Get Categories
      .addCase(getCategories.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getCategories.fulfilled, (state, action) => {
        state.isLoading = false;
        state.categories = action.payload.categories;
        state.error = null;
      })
      .addCase(getCategories.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Get Brands
      .addCase(getBrands.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getBrands.fulfilled, (state, action) => {
        state.isLoading = false;
        state.brands = action.payload.brands;
        state.error = null;
      })
      .addCase(getBrands.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const {
  setFilters,
  clearFilters,
  setCurrentPage,
  clearProductError,
  clearCurrentProduct,
} = productSlice.actions;

export default productSlice.reducer;
