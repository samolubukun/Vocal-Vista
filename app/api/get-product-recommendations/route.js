export async function POST(req) {
    try {
        const { analysis } = await req.json()

        if (!analysis) {
            return Response.json({ products: [] })
        }

        // Extract key product categories from the analysis
        const productSearches = []

        // Map conditions and recommendations to product searches
        if (analysis.skinType === 'oily') {
            productSearches.push('salicylic acid cleanser', 'clay mask')
        }
        if (analysis.skinType === 'dry') {
            productSearches.push('hyaluronic acid serum', 'moisturizing cream')
        }
        if (analysis.skinType === 'sensitive') {
            productSearches.push('cetaphil', 'cerave')
        }

        // Add products based on detected conditions
        if (analysis.conditions) {
            analysis.conditions.forEach(condition => {
                const conditionName = condition.name.toLowerCase()
                
                if (conditionName.includes('acne') || conditionName.includes('pimple')) {
                    productSearches.push('benzoyl peroxide', 'salicylic acid', 'tretinoin')
                }
                if (conditionName.includes('dark spot') || conditionName.includes('hyperpigmentation')) {
                    productSearches.push('vitamin c serum', 'azelaic acid')
                }
                if (conditionName.includes('wrinkle') || conditionName.includes('aging')) {
                    productSearches.push('retinol', 'peptide serum')
                }
                if (conditionName.includes('eczema') || conditionName.includes('dermatitis')) {
                    productSearches.push('cerave', 'cetaphil eczema', 'avene')
                }
                if (conditionName.includes('redness') || conditionName.includes('irritation')) {
                    productSearches.push('niacinamide', 'azelaic acid')
                }
            })
        }

        // Add products from recommendations if they mention specific products
        if (analysis.recommendations) {
            analysis.recommendations.forEach(rec => {
                const recLower = rec.toLowerCase()
                if (recLower.includes('retinol') || recLower.includes('tretinoin')) {
                    if (!productSearches.includes('tretinoin')) productSearches.push('tretinoin')
                }
                if (recLower.includes('vitamin c')) {
                    if (!productSearches.includes('vitamin c serum')) productSearches.push('vitamin c serum')
                }
                if (recLower.includes('sunscreen')) {
                    if (!productSearches.includes('sunscreen spf50')) productSearches.push('sunscreen spf50')
                }
            })
        }

        // Remove duplicates and limit searches
        const uniqueSearches = [...new Set(productSearches)].slice(0, 5)

        // Search for products in MedPlus
        const allProducts = []
        const seenUrls = new Set()

        for (const searchTerm of uniqueSearches) {
            try {
                const searchRes = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/search-products`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ productName: searchTerm })
                })

                if (searchRes.ok) {
                    const data = await searchRes.json()
                    if (data.products && data.products.length > 0) {
                        data.products.forEach(product => {
                            if (!seenUrls.has(product.url)) {
                                seenUrls.add(product.url)
                                allProducts.push(product)
                            }
                        })
                    }
                }
            } catch (error) {
                console.error(`Failed to search for ${searchTerm}:`, error)
            }
        }

        return Response.json({
            products: allProducts.slice(0, 8),
            searchTerms: uniqueSearches
        })

    } catch (error) {
        console.error('Error getting product recommendations:', error)
        return Response.json({
            products: [],
            error: 'Failed to get product recommendations'
        }, { status: 500 })
    }
}
