import { create } from 'zustand';
import { MOCK_INVENTORY } from '../constants/mockData';

export const useInventoryStore = create((set, get) => ({
  items: MOCK_INVENTORY,
  searchQuery: '',
  selectedCategory: 'all',
  selectedWarehouse: 'all',
  selectedFreshness: 'all',
  selectedSort: 'expiry',
  viewMode: 'table', // 'table' | 'cards'
  selectedItem: null,
  isDetailOpen: false,

  setSearchQuery: (query) => set({ searchQuery: query }),
  setSelectedCategory: (cat) => set({ selectedCategory: cat }),
  setSelectedWarehouse: (wh) => set({ selectedWarehouse: wh }),
  setSelectedFreshness: (status) => set({ selectedFreshness: status }),
  setSelectedSort: (sort) => set({ selectedSort: sort }),
  setViewMode: (mode) => set({ viewMode: mode }),

  openDetail: (item) => set({ selectedItem: item, isDetailOpen: true }),
  closeDetail: () => set({ isDetailOpen: false, selectedItem: null }),

  addItem: (newItem) => set((state) => ({ items: [newItem, ...state.items] })),
  deleteItem: (id) => set((state) => ({ items: state.items.filter((item) => item.id !== id) })),
  
  getFilteredItems: () => {
    const { items, searchQuery, selectedCategory, selectedWarehouse, selectedFreshness, selectedSort } = get();
    return items
      .filter((item) => {
        const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.batchId.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategory === 'all' || item.category.toLowerCase() === selectedCategory.toLowerCase();
        const matchesWarehouse = selectedWarehouse === 'all' || item.warehouse === selectedWarehouse;
        const matchesFreshness = selectedFreshness === 'all' || item.status === selectedFreshness;

        return matchesSearch && matchesCategory && matchesWarehouse && matchesFreshness;
      })
      .sort((a, b) => {
        if (selectedSort === 'expiry') return new Date(a.expiryDate) - new Date(b.expiryDate);
        if (selectedSort === 'freshness') return b.freshnessScore - a.freshnessScore;
        if (selectedSort === 'name') return a.name.localeCompare(b.name);
        return 0;
      });
  },
}));
