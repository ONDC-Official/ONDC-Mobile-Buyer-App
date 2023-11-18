import {CLEAR_FILTERS, CLEAR_FILTERS_ONLY, SAVE_FILTERS, SAVE_IDS, SORT_OPTION, UPDATE_FILTERS,} from '../actions';

const initialState = {
  filters: null,
  messageId: null,
  transactionId: null,
  selectedSortOption: null,
  selectedProviders: [],
  selectedCategories: [],
  maxPrice: 0,
  minPrice: 0,
  priceRangeSelected: false,
};

const filterReducer = (state = initialState, action) => {
  const {type, payload} = action;

  switch (type) {
    case SAVE_FILTERS:
      let maxPrice = payload.hasOwnProperty('maxPrice')
        ? Math.ceil(payload.maxPrice)
        : 0;
      let minPrice = payload.hasOwnProperty('minPrice')
        ? Math.floor(payload.minPrice)
        : 0;

      if (maxPrice < state.maxPrice) {
        maxPrice = state.maxPrice;
      }
      if (minPrice > state.minPrice) {
        minPrice = state.minPrice;
      }

      let providers = [];
      let categories = [];
      if (state.filters?.providers) {
        providers = state.filters?.providers.concat(
          payload.providers.filter(
            item =>
              state.filters?.providers.findIndex(one => one.id === item.id) < 0,
          ),
        );
        categories = state.filters?.categories.concat(
          payload.categories.filter(
            item =>
              state.filters?.categories.findIndex(one => one.id === item.id) <
              0,
          ),
        );
      }
      return Object.assign({}, state, {
        filters: {
          providers: providers,
          categories: categories,
          minPrice: minPrice,
          maxPrice: maxPrice,
        },
        maxPrice,
        minPrice,
      });

    case SORT_OPTION:
      return Object.assign({}, state, {selectedSortOption: payload});

    case UPDATE_FILTERS:
      return Object.assign({}, state, {
        selectedProviders: payload.selectedProviders,
        selectedCategories: payload.selectedCategories,
        maxPrice: payload.maxPrice,
        minPrice: payload.minPrice,
        priceRangeSelected: true,
      });

    case SAVE_IDS:
      return Object.assign({}, state, {
        messageId: payload.messageId,
        transactionId: payload.transactionId,
      });

    case CLEAR_FILTERS_ONLY:
      let rangeMaxPrice = state.filters.hasOwnProperty('maxPrice')
        ? Math.ceil(state.filters.maxPrice)
        : 0;
      let rangeMinPrice = state.filters.hasOwnProperty('minPrice')
        ? Math.floor(state.filters.minPrice)
        : 0;
      return Object.assign({}, state, {
        maxPrice: rangeMaxPrice,
        minPrice: rangeMinPrice,
        selectedProviders: [],
        selectedCategories: [],
        priceRangeSelected: false,
      });

    case CLEAR_FILTERS:
      return initialState;

    default:
      return state;
  }
};

export default filterReducer;
