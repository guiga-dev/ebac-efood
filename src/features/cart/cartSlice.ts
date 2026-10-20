import { createSelector, createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { MenuItem } from '../../domain/contracts'

export type CartItem = {
  restaurantId: number
  product: MenuItem
  quantity: number
}

export type CartState = { items: CartItem[]; isOpen: boolean }
const initialState: CartState = { items: [], isOpen: false }
type ItemKey = { restaurantId: number; productId: number }
const matches = (item: CartItem, key: ItemKey) =>
  item.restaurantId === key.restaurantId && item.product.id === key.productId

const slice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addItem(state, action: PayloadAction<Omit<CartItem, 'quantity'>>) {
      const { restaurantId, product } = action.payload
      const existing = state.items.find(item => matches(item, { restaurantId, productId: product.id }))
      if (existing) existing.quantity += 1
      else state.items.push({ restaurantId, product, quantity: 1 })
    },
    removeItem(state, action: PayloadAction<ItemKey>) {
      state.items = state.items.filter(item => !matches(item, action.payload))
    },
    setQuantity(state, action: PayloadAction<ItemKey & { quantity: number }>) {
      if (!Number.isSafeInteger(action.payload.quantity) || action.payload.quantity < 0) return
      if (action.payload.quantity === 0) {
        state.items = state.items.filter(item => !matches(item, action.payload))
        return
      }
      const item = state.items.find(item => matches(item, action.payload))
      if (item) item.quantity = action.payload.quantity
    },
    clearCart(state) { state.items = []; state.isOpen = false },
    openCart(state) { state.isOpen = true },
    closeCart(state) { state.isOpen = false }
  }
})

export const { addItem, removeItem, setQuantity, clearCart, openCart, closeCart } = slice.actions
export const cartReducer = slice.reducer

type WithCart = { cart: CartState }
export const selectCartItems = (state: WithCart) => state.cart.items
export const selectCartIsOpen = (state: WithCart) => state.cart.isOpen
export const selectCartQuantity = createSelector(selectCartItems, items =>
  items.reduce((sum, item) => sum + item.quantity, 0))
export const selectCartTotalInCents = createSelector(selectCartItems, items =>
  items.reduce((sum, item) => sum + Math.round(item.product.preco * 100) * item.quantity, 0))
export const selectCartTotal = createSelector(selectCartTotalInCents, cents => cents / 100)
