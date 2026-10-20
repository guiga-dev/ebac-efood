import { configureStore } from '@reduxjs/toolkit'
import { expect, it, vi } from 'vitest'
import restaurants from '../fixtures/restaurantes.json'
import { createEfoodApi } from '../src/services/api'
import { createEfoodClient } from '../src/services/client'

it('RTK Query armazena consultas em cache e reutiliza a mesma consulta', async () => {
  const transport = vi.fn().mockResolvedValue(new Response(JSON.stringify(restaurants)))
  const api = createEfoodApi(createEfoodClient(transport))
  const store = configureStore({
    reducer: { [api.reducerPath]: api.reducer },
    middleware: getDefault => getDefault().concat(api.middleware)
  })
  const first = store.dispatch(api.endpoints.getRestaurants.initiate())
  const second = store.dispatch(api.endpoints.getRestaurants.initiate())
  expect(await first.unwrap()).toHaveLength(6)
  expect(await second.unwrap()).toHaveLength(6)
  expect(transport).toHaveBeenCalledTimes(1)
  expect(api.endpoints.getRestaurants.select()(store.getState()).isSuccess).toBe(true)
  first.unsubscribe()
  second.unsubscribe()
  store.dispatch(api.util.resetApiState())
})
