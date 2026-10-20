import { createApi, type BaseQueryFn } from '@reduxjs/toolkit/query/react'
import type { Restaurant } from '../domain/contracts'
import { createEfoodClient, EfoodApiError, type ApiErrorData, type EfoodClient } from './client'

type Request = { type: 'restaurants' } | { type: 'restaurant'; id: number }

// A fábrica permite testar o mesmo fluxo RTK Query com transporte injetável.
export function createEfoodApi(client: EfoodClient = createEfoodClient()) {
  const baseQuery: BaseQueryFn<Request, unknown, ApiErrorData> = async (request, api) => {
    try {
      if (request.type === 'restaurants') return { data: await client.getRestaurants(api.signal) }
      return { data: await client.getRestaurant(request.id, api.signal) }
    } catch (error) {
      return { error: error instanceof EfoodApiError ? error.data : {
        status: 'NETWORK_ERROR', message: 'Não foi possível concluir a solicitação.'
      } }
    }
  }
  return createApi({
    reducerPath: 'efoodApi', baseQuery,
    endpoints: builder => ({
      getRestaurants: builder.query<Restaurant[], void>({ query: () => ({ type: 'restaurants' }) }),
      getRestaurant: builder.query<Restaurant, number>({ query: id => ({ type: 'restaurant', id }) })
    })
  })
}

export const efoodApi = createEfoodApi()
export const { useGetRestaurantsQuery, useGetRestaurantQuery } = efoodApi
