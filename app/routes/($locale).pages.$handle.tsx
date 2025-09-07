import {type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {useLoaderData, type MetaFunction} from 'react-router';
import {redirectIfHandleIsLocalized} from '~/lib/redirect';
import {useState} from 'react';

export const meta: MetaFunction<typeof loader> = ({data}) => {
  return [{title: `LunaDesire | ${data?.page.title ?? ''}`}];
};

export async function loader(args: LoaderFunctionArgs) {
  // Start fetching non-critical data without blocking time to first byte
  const deferredData = loadDeferredData(args);

  // Await the critical data required to render initial state of the page
  const criticalData = await loadCriticalData(args);

  return {...deferredData, ...criticalData};
}

/**
 * Load data necessary for rendering content above the fold. This is the critical data
 * needed to render the page. If it's unavailable, the whole page should 400 or 500 error.
 */
async function loadCriticalData({
  context,
  request,
  params,
}: LoaderFunctionArgs) {
  if (!params.handle) {
    throw new Error('Missing page handle');
  }

  const [{page}] = await Promise.all([
    context.storefront.query(PAGE_QUERY, {
      variables: {
        handle: params.handle,
      },
    }),
    // Add other queries here, so that they are loaded in parallel
  ]);

  if (!page) {
    throw new Response('Not Found', {status: 404});
  }

  redirectIfHandleIsLocalized(request, {handle: params.handle, data: page});

  return {
    page,
  };
}

/**
 * Load data for rendering content below the fold. This data is deferred and will be
 * fetched after the initial page load. If it's unavailable, the page should still 200.
 * Make sure to not throw any errors here, as it will cause the page to 500.
 */
function loadDeferredData({context}: LoaderFunctionArgs) {
  return {};
}

// FAQ Component
function FAQItem({ question, answer, isOpen, onToggle }: {
  question: string;
  answer: string;
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="border-b border-gray-200 last:border-b-0">
      <button
        className="w-full text-left py-6 px-4 flex justify-between items-center hover:bg-gray-50 transition-colors duration-200"
        onClick={onToggle}
      >
        <h3 className="text-lg font-semibold text-gray-900 pr-4">{question}</h3>
        <div className={`transform transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}>
          <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>
      <div className={`overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="px-4 pb-6 text-gray-700 leading-relaxed">
          {answer}
        </div>
      </div>
    </div>
  );
}

export default function Page() {
  const {page} = useLoaderData<typeof loader>();
  const [openItems, setOpenItems] = useState<Set<number>>(new Set());

  const toggleItem = (index: number) => {
    const newOpenItems = new Set(openItems);
    if (newOpenItems.has(index)) {
      newOpenItems.delete(index);
    } else {
      newOpenItems.add(index);
    }
    setOpenItems(newOpenItems);
  };

  // FAQ data with your 8 questions
  const faqData = [
    {
      id: 'shipping-discreet',
      question: "Will my package be shipped to me discreetly?",
      answer: "Yes, absolutely. All orders are shipped in plain, unmarked packaging with no indication of the contents. Your privacy and discretion are our top priorities."
    },
    {
      id: 'shipping-partners',
      question: "Who do you use for shipping?",
      answer: "We use trusted shipping partners including FedEx, UPS, and USPS to ensure reliable and discreet delivery of your orders."
    },
    {
      id: 'shipping-time',
      question: "How long will it take for my product to arrive?",
      answer: "Standard shipping takes 3-5 business days, while express shipping takes 1-2 business days. We also offer same-day delivery in select areas."
    },
    {
      id: 'business-hours',
      question: "What hours are you open?",
      answer: "Our customer service is available 24/7 online. For phone support, we're available Monday through Friday from 9 AM to 6 PM EST."
    },
    {
      id: 'return-policy',
      question: "What is your return policy?",
      answer: "We offer a 30-day return policy for unused products in original packaging. Please contact our customer service team for return instructions."
    },
    {
      id: 'credit-cards',
      question: "What credit cards are accepted?",
      answer: "We accept all major credit cards including Visa, MasterCard, American Express, and Discover. All transactions are encrypted and secure."
    },
    {
      id: 'credit-card-storage',
      question: "Do you store credit card information on your servers?",
      answer: "No, we do not store credit card information on our servers. All payment processing is handled by secure, PCI-compliant third-party processors."
    },
    {
      id: 'phone-orders',
      question: "Do you accept phone orders?",
      answer: "No, we do not accept phone orders. All orders must be placed through our secure online store to ensure proper processing and payment security."
    }
  ];

  // Check if this is FAQ page
  const isFAQPage = page.handle === 'frequently-asked-questions';

  return (
    <div className="page">
      <div className="pt-16">
        {/* Hero Section */}
        <div className="relative bg-gradient-to-br from-purple-600 to-purple-800 text-white overflow-hidden">
          {/* Background Image Overlay - only for About page */}
          {page.handle === 'about' && (
            <div 
              className="absolute inset-0 bg-cover bg-center bg-no-repeat"
              style={{
                backgroundImage: "url('/images/about.png')"
              }}
            />
          )}
          
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
                {page.title}
              </h1>
              <div className="w-24 h-1 bg-purple-400 mx-auto rounded-full"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-4xl mx-auto">
          {isFAQPage ? (
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="p-8 md:p-12">
                <div className="space-y-0">
                  {faqData.map((item, index) => (
                    <FAQItem
                      key={item.id}
                      question={item.question}
                      answer={item.answer}
                      isOpen={openItems.has(index)}
                      onToggle={() => toggleItem(index)}
                    />
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-lg p-8 md:p-12">
              <div 
                className="prose prose-lg max-w-none prose-purple prose-headings:text-gray-900 prose-p:text-gray-700 prose-a:text-purple-600 prose-a:no-underline hover:prose-a:underline"
                dangerouslySetInnerHTML={{__html: page.body}} 
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const PAGE_QUERY = `#graphql
  query Page(
    $language: LanguageCode,
    $country: CountryCode,
    $handle: String!
  )
  @inContext(language: $language, country: $country) {
    page(handle: $handle) {
      handle
      id
      title
      body
      seo {
        description
        title
      }
    }
  }
` as const;
