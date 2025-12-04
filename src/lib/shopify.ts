import { toast } from "sonner";

export const SHOPIFY_API_VERSION = '2025-07';
export const SHOPIFY_STORE_PERMANENT_DOMAIN = 'yjmkpk-ix.myshopify.com';
export const SHOPIFY_STOREFRONT_URL = `https://${SHOPIFY_STORE_PERMANENT_DOMAIN}/api/${SHOPIFY_API_VERSION}/graphql.json`;
export const SHOPIFY_STOREFRONT_TOKEN = 'a9f20992727f7a411b693dde94f9117e';

export interface ShopifyProduct {
  node: {
    id: string;
    title: string;
    description: string;
    handle: string;
    productType?: string;
    tags?: string[];
    priceRange: {
      minVariantPrice: {
        amount: string;
        currencyCode: string;
      };
    };
    images: {
      edges: Array<{
        node: {
          url: string;
          altText: string | null;
        };
      }>;
    };
    variants: {
      edges: Array<{
        node: {
          id: string;
          title: string;
          price: {
            amount: string;
            currencyCode: string;
          };
          compareAtPrice?: {
            amount: string;
            currencyCode: string;
          } | null;
          availableForSale: boolean;
          selectedOptions: Array<{
            name: string;
            value: string;
          }>;
        };
      }>;
    };
    options: Array<{
      name: string;
      values: string[];
    }>;
  };
}

export async function storefrontApiRequest(query: string, variables: Record<string, unknown> = {}) {
  const response = await fetch(SHOPIFY_STOREFRONT_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': SHOPIFY_STOREFRONT_TOKEN
    },
    body: JSON.stringify({
      query,
      variables,
    }),
  });

  if (response.status === 402) {
    toast.error("Shopify: Payment required", {
      description: "Shopify API access requires an active Shopify billing plan. Visit https://admin.shopify.com to upgrade.",
    });
    return null;
  }

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();
  
  if (data.errors) {
    throw new Error(`Error calling Shopify: ${data.errors.map((e: { message: string }) => e.message).join(', ')}`);
  }

  return data;
}

export const PRODUCTS_QUERY = `
  query GetProducts($first: Int!, $query: String) {
    products(first: $first, query: $query) {
      edges {
        node {
          id
          title
          description
          handle
          productType
          tags
          priceRange {
            minVariantPrice {
              amount
              currencyCode
            }
          }
          images(first: 5) {
            edges {
              node {
                url
                altText
              }
            }
          }
          variants(first: 10) {
            edges {
              node {
                id
                title
                price {
                  amount
                  currencyCode
                }
                compareAtPrice {
                  amount
                  currencyCode
                }
                availableForSale
                selectedOptions {
                  name
                  value
                }
              }
            }
          }
          options {
            name
            values
          }
        }
      }
    }
  }
`;

export const PRODUCT_BY_HANDLE_QUERY = `
  query GetProductByHandle($handle: String!) {
    productByHandle(handle: $handle) {
      id
      title
      description
      handle
      productType
      vendor
      tags
      priceRange {
        minVariantPrice {
          amount
          currencyCode
        }
      }
      images(first: 10) {
        edges {
          node {
            url
            altText
          }
        }
      }
      variants(first: 20) {
        edges {
          node {
            id
            title
            price {
              amount
              currencyCode
            }
            compareAtPrice {
              amount
              currencyCode
            }
            availableForSale
            selectedOptions {
              name
              value
            }
          }
        }
      }
      options {
        name
        values
      }
    }
  }
`;

// Collections Query
export const COLLECTIONS_QUERY = `
  query GetCollections($first: Int!) {
    collections(first: $first) {
      edges {
        node {
          id
          title
          handle
          description
          image {
            url
            altText
          }
        }
      }
    }
  }
`;

export interface ShopifyCollection {
  node: {
    id: string;
    title: string;
    handle: string;
    description: string;
    image: {
      url: string;
      altText: string | null;
    } | null;
  };
}

export async function fetchCollections(first: number = 20): Promise<ShopifyCollection[]> {
  const data = await storefrontApiRequest(COLLECTIONS_QUERY, { first });
  if (!data) return [];
  return data.data.collections.edges as ShopifyCollection[];
}

// Category mappings for filtering - maps URL category to Shopify search terms
export const CATEGORY_SEARCH_MAPPINGS: Record<string, string[]> = {
  // Plants
  'plants': ['plant', 'plants', 'tree', 'indoor plant', 'outdoor plant'],
  'mixed-plant': ['mixed plant', 'mixed plants'],
  'palm-tree': ['palm', 'palm tree'],
  'ficus-tree': ['ficus', 'ficus tree'],
  'olive-tree': ['olive', 'olive tree'],
  'paradise-plant': ['paradise', 'bird of paradise'],
  'bamboo-tree': ['bamboo', 'bamboo tree'],
  
  // Flowers
  'flowers': ['flower', 'flowers', 'bouquet', 'floral'],
  'fresh-flowers': ['fresh flower', 'fresh flowers'],
  'artificial-flowers': ['artificial flower', 'silk flower', 'fake flower'],
  'flower-bouquets': ['bouquet', 'flower bouquet'],
  
  // Pots
  'pots': ['pot', 'pots', 'planter', 'container'],
  'fiber-pot': ['fiber pot', 'fibre pot', 'fiber'],
  'plastic-pot': ['plastic pot', 'plastic'],
  'ceramic-pot': ['ceramic pot', 'ceramic'],
  'terracotta-pot': ['terracotta', 'terra cotta', 'clay pot'],
  
  // Greenery
  'greenery': ['greenery', 'green wall', 'moss', 'grass'],
  'green-wall': ['green wall', 'vertical garden', 'wall plant'],
  'greenery-bunch': ['greenery bunch', 'bunch', 'foliage'],
  'moss': ['moss'],
  'grass': ['grass', 'artificial grass'],
  
  // Other categories
  'hanging': ['hanging', 'hanging plant', 'suspended'],
  'vases': ['vase', 'vases'],
  'gifts': ['gift', 'gifts', 'gift set'],
  'sale': ['sale', 'discount', 'clearance'],
  'new-arrivals': ['new', 'arrival'],
};

export async function fetchProducts(first: number = 20, query?: string) {
  const data = await storefrontApiRequest(PRODUCTS_QUERY, { first, query });
  if (!data) return [];
  return data.data.products.edges as ShopifyProduct[];
}

export async function fetchProductsByCategory(category: string, first: number = 50) {
  // Get search terms for this category
  const searchTerms = CATEGORY_SEARCH_MAPPINGS[category];
  
  if (!searchTerms || searchTerms.length === 0) {
    // If no mapping, fetch all products
    return fetchProducts(first);
  }
  
  // Build a query that searches for any of the terms
  // Shopify Storefront API supports OR queries with multiple terms
  const query = searchTerms.map(term => `title:*${term}* OR product_type:*${term}* OR tag:${term}`).join(' OR ');
  
  return fetchProducts(first, query);
}

export async function fetchProductByHandle(handle: string) {
  const data = await storefrontApiRequest(PRODUCT_BY_HANDLE_QUERY, { handle });
  if (!data) return null;
  return data.data.productByHandle;
}

// Helper to filter products client-side based on category
export function filterProductsByCategory(products: ShopifyProduct[], category: string): ShopifyProduct[] {
  if (category === 'all' || !category) return products;
  
  const searchTerms = CATEGORY_SEARCH_MAPPINGS[category];
  if (!searchTerms || searchTerms.length === 0) return products;
  
  return products.filter(product => {
    const title = product.node.title.toLowerCase();
    const productType = (product.node.productType || '').toLowerCase();
    const tags = (product.node.tags || []).map(t => t.toLowerCase());
    const description = (product.node.description || '').toLowerCase();
    
    return searchTerms.some(term => {
      const lowerTerm = term.toLowerCase();
      return (
        title.includes(lowerTerm) ||
        productType.includes(lowerTerm) ||
        tags.some(tag => tag.includes(lowerTerm)) ||
        description.includes(lowerTerm)
      );
    });
  });
}

// Check if a product is on sale (has compare at price higher than current price)
export function isProductOnSale(product: ShopifyProduct): boolean {
  const variants = product.node.variants.edges;
  return variants.some(v => {
    const compareAtPrice = v.node.compareAtPrice;
    const price = v.node.price;
    if (!compareAtPrice) return false;
    return parseFloat(compareAtPrice.amount) > parseFloat(price.amount);
  });
}
