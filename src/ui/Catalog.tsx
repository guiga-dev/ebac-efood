import { Link, useParams } from 'react-router-dom'
import { useState } from 'react'
import { useGetRestaurantQuery, useGetRestaurantsQuery } from '../services/api'
import { useAppDispatch, useAppSelector } from '../app/store'
import { restaurantPath } from '../app/AppRoutes'
import { addItem, openCart, selectCartQuantity } from '../features/cart/cartSlice'
import type { MenuItem } from '../domain/contracts'
import { assets, money } from './assets'
import * as S from './styles'
import { OverlayFocus } from './Overlay'

export function SiteFooter() {
  return <S.Footer><Link to="/" className="brand" aria-label="efood — página inicial"><img src={assets.logo} alt="efood" /></Link>
    <div className="socials"><a href="https://www.instagram.com/" aria-label="Instagram"><img src={assets.instagram} alt="" /></a><a href="https://www.facebook.com/" aria-label="Facebook"><img src={assets.facebook} alt="" /></a><a href="https://twitter.com/" aria-label="Twitter"><img src={assets.twitter} alt="" /></a></div>
    <p>A efood é uma plataforma para divulgação de estabelecimentos, a responsabilidade pela entrega, qualidade dos produtos é toda do estabelecimento contratado.</p></S.Footer>
}
export function SiteHeader() {
  const quantity = useAppSelector(selectCartQuantity), dispatch = useAppDispatch()
  return <S.Header><img src={assets.headerBackground} alt="" /><S.Container><Link to="/">Restaurantes</Link><Link className="brand" to="/" aria-label="efood — página inicial"><img src={assets.logo} alt="efood" /></Link><button onClick={() => dispatch(openCart())}>{quantity} produto(s) no carrinho</button></S.Container></S.Header>
}
export function Home() {
  const { data, isLoading, isError, refetch } = useGetRestaurantsQuery()
  return <><S.Hero><img src={assets.homeBackground} alt="" /><Link to="/" aria-label="efood — página inicial"><img src={assets.logo} alt="efood" /></Link><h1>Viva experiências gastronômicas<br />no conforto da sua casa</h1></S.Hero>
    {isLoading ? <S.Status role="status">Carregando restaurantes...</S.Status> : isError ? <S.Status role="alert"><p>Não foi possível carregar os restaurantes.</p><S.Button onClick={() => refetch()}>Tentar novamente</S.Button></S.Status> : <S.RestaurantGrid>{data?.map(restaurant => <S.RestaurantCard key={restaurant.id}>
      <div className="cover"><img src={restaurant.capa} alt={restaurant.titulo} /><div className="tags">{restaurant.destacado && <span className="tag">Destaque da semana</span>}<span className="tag">{restaurant.tipo}</span></div></div>
      <div className="body"><div className="title"><h2>{restaurant.titulo}</h2><span className="rating">{restaurant.avaliacao.toFixed(1)}<img src={assets.star} alt="estrelas" /></span></div><p>{restaurant.descricao}</p><Link className="more" to={restaurantPath(restaurant.id)} aria-label={`Saiba mais sobre ${restaurant.titulo}`}>Saiba mais</Link></div>
    </S.RestaurantCard>)}</S.RestaurantGrid>}<SiteFooter /></>
}
export function RestaurantPage() {
  const { id } = useParams(), restaurantId = Number(id)
  const { data, isLoading, isError, refetch } = useGetRestaurantQuery(restaurantId)
  const [selected, setSelected] = useState<MenuItem | null>(null)
  const dispatch = useAppDispatch()
  return <><SiteHeader />{isLoading ? <S.Status role="status">Carregando cardápio...</S.Status> : isError || !data ? <S.Status role="alert"><p>Não foi possível encontrar o restaurante.</p><S.Button onClick={() => refetch()}>Tentar novamente</S.Button><p><Link to="/">Voltar para restaurantes</Link></p></S.Status> : <>
    <S.RestaurantHero><img src={data.capa} alt="" /><div className="shade" /><S.Container><p>{data.tipo}</p><h1>{data.titulo}</h1></S.Container></S.RestaurantHero>
    <S.ProductGrid>{data.cardapio.map(product => <S.ProductCard key={product.id}><img src={product.foto} alt={product.nome} /><h2>{product.nome}</h2><p>{product.descricao}</p><S.Button onClick={() => setSelected(product)} aria-label={`Mais detalhes sobre ${product.nome}`}>Mais detalhes</S.Button></S.ProductCard>)}</S.ProductGrid>
    {selected && <OverlayFocus onClose={() => setSelected(null)}><S.ModalPosition><S.OverlayButton aria-label="Fechar detalhes" tabIndex={-1} onClick={() => setSelected(null)} /><S.ModalBox role="dialog" aria-modal="true" aria-labelledby="product-title"><img className="product-photo" src={selected.foto} alt={selected.nome} /><div><h2 id="product-title">{selected.nome}</h2><p>{selected.descricao}</p><p className="portion">Serve: {selected.porcao}</p><S.Button className="add" onClick={() => { dispatch(addItem({ restaurantId, product: selected })); setSelected(null); dispatch(openCart()) }}>Adicionar ao carrinho - {money(selected.preco)}</S.Button></div><button className="close" aria-label="Fechar modal" onClick={() => setSelected(null)}><img src={assets.close} alt="" /></button></S.ModalBox></S.ModalPosition></OverlayFocus>}
    </>}<SiteFooter /></>
}
