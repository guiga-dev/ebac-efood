import { describe, expect, it } from 'vitest'
import {
  cartReducer, addItem, removeItem, setQuantity, clearCart, openCart, closeCart,
  selectCartQuantity, selectCartTotal, selectCartTotalInCents
} from '../src/features/cart/cartSlice'
import { product } from './helpers'

describe('Carrinho Redux', () => {
  it('adiciona produtos e incrementa a quantidade do mesmo item', () => {
    const first = cartReducer(undefined, addItem({ restaurantId: 1, product }))
    const second = cartReducer(first, addItem({ restaurantId: 1, product }))
    expect(first.items[0].quantity).toBe(1)
    expect(second.items).toHaveLength(1)
    expect(second.items[0].quantity).toBe(2)
    expect(selectCartQuantity({ cart: second })).toBe(2)
  })

  it('remove somente o item escolhido e permite zerar quantidade', () => {
    let state = cartReducer(undefined, addItem({ restaurantId: 1, product }))
    state = cartReducer(state, addItem({ restaurantId: 1, product: { ...product, id: 2 } }))
    state = cartReducer(state, removeItem({ restaurantId: 1, productId: 1 }))
    expect(state.items.map(item => item.product.id)).toEqual([2])
    state = cartReducer(state, setQuantity({ restaurantId: 1, productId: 2, quantity: 0 }))
    expect(state.items).toEqual([])
  })

  it('rejeita quantidade negativa e fracionada', () => {
    const state = cartReducer(undefined, addItem({ restaurantId: 1, product }))
    for (const quantity of [-1, 1.5, NaN]) {
      expect(cartReducer(state, setQuantity({ restaurantId: 1, productId: 1, quantity }))).toEqual(state)
    }
  })

  it('soma preços e quantidades em centavos, sem erro de ponto flutuante', () => {
    let state = cartReducer(undefined, addItem({ restaurantId: 1, product: { ...product, preco: 0.1 } }))
    state = cartReducer(state, addItem({ restaurantId: 1, product: { ...product, id: 2, preco: 0.2 } }))
    state = cartReducer(state, setQuantity({ restaurantId: 1, productId: 2, quantity: 3 }))
    expect(selectCartTotalInCents({ cart: state })).toBe(70)
    expect(selectCartTotal({ cart: state })).toBe(0.7)
  })

  it('abre, fecha e limpa o carrinho', () => {
    let state = cartReducer(undefined, addItem({ restaurantId: 1, product }))
    state = cartReducer(state, openCart())
    expect(state.isOpen).toBe(true)
    expect(cartReducer(state, closeCart()).isOpen).toBe(false)
    expect(cartReducer(state, clearCart())).toEqual({ items: [], isOpen: false })
  })
})
