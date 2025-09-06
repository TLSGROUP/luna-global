import {Suspense} from 'react';
import {Await, NavLink, useAsyncValue} from 'react-router';
import {
  type CartViewPayload,
  useAnalytics,
  useOptimisticCart,
} from '@shopify/hydrogen';
import type {HeaderQuery, CartApiQueryFragment} from 'storefrontapi.generated';
import {useAside} from '~/components/Aside';

interface HeaderProps {
  header: HeaderQuery;
  cart: Promise<CartApiQueryFragment | null>;
  isLoggedIn: Promise<boolean>;
  publicStoreDomain: string;
}

type Viewport = 'desktop' | 'mobile';

export function Header({
  header,
  isLoggedIn,
  cart,
  publicStoreDomain,
}: HeaderProps) {
  const {shop, menu} = header;
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center h-16">
          {/* Left side - Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8 w-1/3">
        <HeaderMenu
          menu={menu}
          viewport="desktop"
          primaryDomainUrl={header.shop.primaryDomain.url}
          publicStoreDomain={publicStoreDomain}
          isLoggedIn={isLoggedIn}
        />
          </div>

          {/* Mobile menu toggle - only visible on mobile */}
          <div className="md:hidden w-1/3 flex justify-start">
            <HeaderMenuMobileToggle />
          </div>

          {/* Center Logo */}
          <div className="flex-1 flex justify-center md:w-1/3">
            <NavLink 
              prefetch="intent" 
              to="/" 
              className="logo-link text-3xl md:text-4xl font-bold text-purple-600 hover:text-purple-700 transition-colors duration-200 tracking-tight"
              style={{textDecoration: 'none'}}
              end
            >
              {shop.name}
            </NavLink>
          </div>

          {/* Right side CTAs */}
          <div className="flex items-center space-x-4 w-1/3 justify-end">
            <NavLink 
              prefetch="intent" 
              to="/account" 
              className="hidden md:block text-sm font-medium text-gray-700 hover:text-purple-600 transition-colors duration-200"
            >
              <Suspense fallback="Sign in">
                <Await resolve={isLoggedIn} errorElement="Sign in">
                  {(isLoggedIn) => (isLoggedIn ? 'Account' : 'Sign in')}
                </Await>
              </Suspense>
            </NavLink>
            <CartToggle cart={cart} />
          </div>
        </div>
      </div>

      {/* Mobile menu - скрыто по умолчанию, показывается через Aside */}
    </header>
  );
}

export function HeaderMenu({
  menu,
  primaryDomainUrl,
  viewport,
  publicStoreDomain,
  isLoggedIn,
}: {
  menu: HeaderProps['header']['menu'];
  primaryDomainUrl: HeaderProps['header']['shop']['primaryDomain']['url'];
  viewport: Viewport;
  publicStoreDomain: HeaderProps['publicStoreDomain'];
  isLoggedIn: HeaderProps['isLoggedIn'];
}) {
  const {close} = useAside();

  if (viewport === 'mobile') {
    return (
      <nav className="px-4 py-2 bg-gray-50 border-t border-gray-200">
        {/* Sign In / Account link */}
        <NavLink
          className="block py-2 text-base font-medium text-gray-900 hover:text-purple-600 border-b border-gray-200 mb-2"
          end
          onClick={close}
          prefetch="intent"
          to="/account"
        >
          <Suspense fallback="Sign in">
            <Await resolve={isLoggedIn} errorElement="Sign in">
              {(isLoggedIn) => (isLoggedIn ? 'Account' : 'Sign in')}
            </Await>
          </Suspense>
        </NavLink>
        
        {/* Menu items */}
        {(menu || FALLBACK_HEADER_MENU).items.map((item) => {
          if (!item.url) return null;

          const url =
            item.url.includes('myshopify.com') ||
            item.url.includes(publicStoreDomain) ||
            item.url.includes(primaryDomainUrl)
              ? new URL(item.url).pathname
              : item.url;
          return (
            <NavLink
              className="block py-2 text-base font-medium text-gray-900 hover:text-purple-600"
              end
              key={item.id}
              onClick={close}
              prefetch="intent"
              to={url}
            >
              {item.title}
            </NavLink>
          );
        })}
      </nav>
    );
  }

  return (
    <>
      {(menu || FALLBACK_HEADER_MENU).items.map((item) => {
        if (!item.url) return null;

        const url =
          item.url.includes('myshopify.com') ||
          item.url.includes(publicStoreDomain) ||
          item.url.includes(primaryDomainUrl)
            ? new URL(item.url).pathname
            : item.url;
        return (
          <NavLink
            className="text-sm font-medium text-gray-700 hover:text-purple-600 transition-colors duration-200"
            end
            key={item.id}
            prefetch="intent"
            to={url}
          >
            {item.title}
          </NavLink>
        );
      })}
    </>
  );
}

function HeaderCtas({
  isLoggedIn,
  cart,
}: Pick<HeaderProps, 'isLoggedIn' | 'cart'>) {
  return (
    <div className="flex items-center space-x-4">
      {/* This component is now integrated directly in the main header layout */}
    </div>
  );
}

function HeaderMenuMobileToggle() {
  const {open} = useAside();
  return (
    <button
      className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 transition-colors duration-200"
      onClick={() => open('mobile')}
      aria-label="Open menu"
    >
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
      </svg>
    </button>
  );
}

function SearchToggle() {
  const {open} = useAside();
  return (
    <button 
      className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 transition-colors duration-200" 
      onClick={() => open('search')}
      aria-label="Search"
    >
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
    </button>
  );
}

function CartBadge({count}: {count: number | null}) {
  const {open} = useAside();
  const {publish, shop, cart, prevCart} = useAnalytics();

  return (
    <button
      className="relative inline-flex items-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 transition-colors duration-200"
      onClick={(e) => {
        e.preventDefault();
        open('cart');
        publish('cart_viewed', {
          cart,
          prevCart,
          shop,
          url: window.location.href || '',
        } as CartViewPayload);
      }}
      aria-label={`Cart with ${count || 0} items`}
    >
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
      </svg>
      {count !== null && count > 0 && (
        <span className="absolute -top-1 -right-1 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-purple-600 rounded-full min-w-[1.25rem] h-5">
          {count > 99 ? '99+' : count}
        </span>
      )}
      <span className="hidden sm:inline-block ml-2 text-sm font-medium text-gray-700">
        Cart {count === null ? '' : `(${count})`}
      </span>
    </button>
  );
}

function CartToggle({cart}: Pick<HeaderProps, 'cart'>) {
  return (
    <Suspense fallback={<CartBadge count={null} />}>
      <Await resolve={cart}>
        <CartBanner />
      </Await>
    </Suspense>
  );
}

function CartBanner() {
  const originalCart = useAsyncValue() as CartApiQueryFragment | null;
  const cart = useOptimisticCart(originalCart);
  return <CartBadge count={cart?.totalQuantity ?? 0} />;
}

const FALLBACK_HEADER_MENU = {
  id: 'gid://shopify/Menu/199655587896',
  items: [
    {
      id: 'gid://shopify/MenuItem/461609500728',
      resourceId: null,
      tags: [],
      title: 'Collections',
      type: 'HTTP',
      url: '/collections',
      items: [],
    },
    {
      id: 'gid://shopify/MenuItem/461609533496',
      resourceId: null,
      tags: [],
      title: 'Blog',
      type: 'HTTP',
      url: '/blogs/journal',
      items: [],
    },
    {
      id: 'gid://shopify/MenuItem/461609566264',
      resourceId: null,
      tags: [],
      title: 'Policies',
      type: 'HTTP',
      url: '/policies',
      items: [],
    },
    {
      id: 'gid://shopify/MenuItem/461609599032',
      resourceId: 'gid://shopify/Page/92591030328',
      tags: [],
      title: 'About',
      type: 'PAGE',
      url: '/pages/about',
      items: [],
    },
  ],
};

function activeLinkStyle({
  isActive,
  isPending,
}: {
  isActive: boolean;
  isPending: boolean;
}) {
  return {
    fontWeight: isActive ? 'bold' : undefined,
    color: isPending ? 'grey' : isActive ? '#9333ea' : undefined,
  };
}
