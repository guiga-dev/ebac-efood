import { useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import type { EfoodClient } from '../services/client'
import { AppRoutes } from '../app/AppRoutes'
import { Home, RestaurantPage, SiteFooter, SiteHeader } from './Catalog'
import { CartCheckout } from './CartCheckout'
import { GlobalStyle, Status } from './styles'

export function EfoodApp({ checkoutClient }: { checkoutClient?: EfoodClient }) {
  const location = useLocation()
  useEffect(() => { window.scrollTo(0, 0) }, [location.pathname])
  return <><GlobalStyle /><AppRoutes home={<Home />} restaurant={<RestaurantPage />} notFound={<><SiteHeader /><Status><h1>Página não encontrada</h1><Link to="/">Voltar para restaurantes</Link></Status><SiteFooter /></>} /><CartCheckout checkoutClient={checkoutClient} /></>
}
