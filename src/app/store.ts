import { configureStore } from '@reduxjs/toolkit'
import { useDispatch, useSelector, type TypedUseSelectorHook } from 'react-redux'
import { cartReducer } from '../features/cart/cartSlice'
import { efoodApi } from '../services/api'

export function createAppStore() {
  return configureStore({
    reducer: { cart: cartReducer, [efoodApi.reducerPath]: efoodApi.reducer },
    middleware: getDefault => getDefault().concat(efoodApi.middleware)
  })
}
export const store = createAppStore()
export type AppStore = ReturnType<typeof createAppStore>
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']
export const useAppDispatch = () => useDispatch<AppDispatch>()
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
