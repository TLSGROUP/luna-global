import {Link} from 'react-router';
import {Image, Money} from '@shopify/hydrogen';
import type {
  ProductItemFragment,
  CollectionItemFragment,
} from 'storefrontapi.generated';
import {useVariantUrl} from '~/lib/variants';

export function ProductItem({
  product,
  loading,
}: {
  product:
    | CollectionItemFragment
    | ProductItemFragment;
  loading?: 'eager' | 'lazy';
}) {
  const variantUrl = useVariantUrl(product.handle);
  const image = product.featuredImage;
  
  // Calculate if there's a discount
  const priceRange = product.priceRange;
  const minPrice = priceRange?.minVariantPrice;
  const maxPrice = 'maxVariantPrice' in priceRange ? priceRange.maxVariantPrice : null;
  const minPriceAmount = minPrice ? Number.parseFloat(minPrice.amount) : null;
  const showFreeShipmentBadge =
    !!minPrice &&
    minPrice.currencyCode === 'USD' &&
    typeof minPriceAmount === 'number' &&
    !Number.isNaN(minPriceAmount) &&
    minPriceAmount >= 70;
  const hasDiscount = minPrice && maxPrice && minPrice.amount !== maxPrice.amount;
  
  return (
    <Link
      className="group relative flex w-full max-w-[320px] flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:shadow-md no-underline"
      style={{textDecoration: 'none'}}
      key={product.id}
      prefetch="intent"
      to={variantUrl}
    >

      {/* Image container with background glow effect */}
      <div className="relative overflow-hidden bg-gradient-to-br from-indigo-50 via-purple-50 to-violet-100 p-4 sm:p-6">
        {showFreeShipmentBadge && (
          <div className="absolute top-3 left-3 z-10">
            <span className="relative inline-block rounded-full bg-gradient-to-r from-purple-500 to-indigo-700 px-3 py-1.5 text-xs font-semibold text-white">
              Free Shipment
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-purple-400 opacity-75"></span>
                <span className="relative inline-flex h-3 w-3 rounded-full bg-purple-500"></span>
              </span>
            </span>
          </div>
        )}
        <div className="absolute -bottom-10 left-1/2 h-40 w-40 -translate-x-1/2 transform rounded-full bg-purple-500/20 blur-3xl"></div>
        <div className="transition-transform duration-500 group-hover:scale-105 group-hover:rotate-2">
          {image && (
            <Image
              alt={image.altText || product.title}
              aspectRatio="1/1"
              data={image}
              loading={loading}
              sizes="(min-width: 45em) 400px, 100vw"
              className="rounded-lg object-contain h-[140px] sm:h-[180px] mx-auto drop-shadow-lg"
            />
          )}
        </div>
      </div>

      {/* Product details */}
      <div className="flex flex-1 flex-col gap-2 sm:gap-3 p-4 sm:p-5">
        <div>
          <h3 className="mb-1 text-lg sm:text-xl font-semibold tracking-tight text-gray-900">
            {product.title}
          </h3>
          <p className="text-xs text-gray-600">
            Manufacturer: {product.vendor}
          </p>
        </div>

        {/* Features - скрываем на мобильных, показываем на планшетах+ */}
        <div className="mb-1 hidden sm:block">
          <p className="mb-1 text-xs font-medium text-gray-500 uppercase">
            Key Benefits
          </p>
          <div className="grid grid-cols-2 gap-x-2 gap-y-1">
            <div className="flex items-center text-xs">
              <svg
                className="mr-1.5 h-3.5 w-3.5 shrink-0 text-purple-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <span className="text-gray-700">
                High Quality
              </span>
            </div>
            <div className="flex items-center text-xs">
              <svg
                className="mr-1.5 h-3.5 w-3.5 shrink-0 text-purple-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <span className="text-gray-700">
                Fast Delivery
              </span>
            </div>
          </div>
        </div>

        {/* Price with shipping info */}
        <div className="mt-auto">
          <div className="flex items-center gap-2">
            {hasDiscount && maxPrice && (
              <span className="text-lg font-semibold text-gray-600 line-through">
                <Money data={maxPrice} />
              </span>
            )}
            {minPrice && (
              <span className="text-xl sm:text-2xl font-bold text-purple-600">
                <Money data={minPrice} />
              </span>
            )}
          </div>

          <p className="mt-1 inline-flex items-center text-xs sm:text-sm text-green-600">
            <svg
              className="mr-1 h-3 w-3 sm:h-4 sm:w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth="2"
            >
              <line x1="19" y1="5" x2="5" y2="19" />
              <circle cx="6.5" cy="6.5" r="2.5" />
              <circle cx="17.5" cy="17.5" r="2.5" />
            </svg>
            <span className="hidden sm:inline">TAX Include</span>
            <span className="sm:hidden">TAX Include</span>
          </p>
        </div>

        {/* Action buttons */}
        <div className="mt-2 sm:mt-3 flex flex-col gap-2 sm:gap-3">
          <button className="w-full border border-gray-300 bg-white text-gray-800 transition-all duration-200 hover:border-purple-500 hover:bg-gray-50 px-3 sm:px-4 py-2 rounded-md text-sm sm:text-base">
            Add to cart
          </button>
          <button className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white transition-all hover:from-indigo-700 hover:to-purple-700 px-3 sm:px-4 py-2 rounded-md text-sm sm:text-base">
            Buy now
          </button>
        </div>
      </div>
    </Link>
  );
}
