export interface BarcodeProductData {
  name: string;
  brand?: string;
  category?: string;
  description?: string;
  imageUrl?: string;
}

export interface BarcodeLookupResult {
  found: boolean;
  data?: BarcodeProductData;
  error?: string;
}

/**
 * Fetches product information from Open Food Facts API using a barcode
 * @param barcode - The UPC/EAN barcode number (12 or 13 digits)
 * @returns Product data if found, or null if not found
 */
export async function lookupBarcodeByOpenFoodFacts(
  barcode: string
): Promise<BarcodeLookupResult> {
  try {
    // Validate barcode format (should be 12 or 13 digits)
    const cleanBarcode = barcode.replace(/\D/g, '');
    if (cleanBarcode.length !== 12 && cleanBarcode.length !== 13) {
      return {
        found: false,
        error: 'Invalid barcode format. Must be 12 or 13 digits.',
      };
    }

    const response = await fetch(
      `https://world.openfoodfacts.org/api/v0/product/${cleanBarcode}.json`,
      {
        method: 'GET',
        headers: {
          'User-Agent': 'SmartMartPro/1.0',
        },
      }
    );

    if (!response.ok) {
      return {
        found: false,
        error: 'Failed to fetch product data from Open Food Facts API',
      };
    }

    const data = await response.json();

    // Check if product was found
    if (data.status !== 1 || !data.product) {
      return {
        found: false,
        error: 'Product not found in Open Food Facts database',
      };
    }

    const product = data.product;

    // Extract relevant product information
    const productData: BarcodeProductData = {
      name: product.product_name || product.product_name_en || '',
      brand: product.brands || product.brands_tags?.[0] || '',
      category: product.categories_tags?.[0] || product.categories || '',
      description: product.ingredients_text || product.generic_name || '',
      imageUrl: product.image_front_url || product.image_url || '',
    };

    return {
      found: true,
      data: productData,
    };
  } catch (error) {
    console.error('Error looking up barcode:', error);
    return {
      found: false,
      error: 'An error occurred while looking up the barcode',
    };
  }
}

/**
 * Validates if a string is a valid UPC/EAN barcode
 * @param barcode - The barcode string to validate
 * @returns true if valid, false otherwise
 */
export function isValidBarcode(barcode: string): boolean {
  const cleanBarcode = barcode.replace(/\D/g, '');
  return cleanBarcode.length === 12 || cleanBarcode.length === 13;
}
