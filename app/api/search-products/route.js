export async function POST(req) {
    try {
        const { productName } = await req.json()

        if (!productName || productName.trim().length === 0) {
            return Response.json({ products: [] })
        }

        // Use the accurate /searched-products endpoint instead of /products
        const searchUrl = `https://medplusnig.com/searched-products?name=${encodeURIComponent(productName)}`
        
        const response = await fetch(searchUrl, {
            method: 'GET',
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                'X-Requested-With': 'XMLHttpRequest',
                'Accept': 'application/json'
            }
        })

        if (!response.ok) {
            return Response.json({ products: [], error: 'Failed to search products' }, { status: 400 })
        }

        const data = await response.json()
        
        // The API returns HTML in the 'result' field
        if (!data.result) {
            return Response.json({ products: [], searchQuery: productName, searchUrl: searchUrl })
        }

        let products = []
        
        // Try Cheerio first to parse the HTML result
        try {
            const { load } = await import('cheerio')
            const $ = load(data.result)
            
            const seen = new Set()
            
            // Parse the <ul> with <li> items containing <a> tags
            $('li.list-group-item a').each((index, element) => {
                if (products.length >= 5) return
                
                const $link = $(element)
                const productUrl = $link.attr('href')
                const productName = $link.text().trim()
                
                if (!productUrl || !productName || seen.has(productUrl)) return
                
                seen.add(productUrl)
                products.push({
                    name: productName.substring(0, 100),
                    url: productUrl,
                    price: null, // Price not included in this endpoint
                    source: 'MedPlus'
                })
            })
            
            if (products.length > 0) {
                return Response.json({ 
                    products: products.slice(0, 5),
                    searchQuery: productName,
                    searchUrl: searchUrl,
                    method: 'cheerio'
                })
            }
        } catch (cheerioError) {
            console.log('Cheerio parsing failed, falling back to regex:', cheerioError.message)
        }

        // Fallback to regex if Cheerio fails
        products = []
        const productLinkRegex = /<a\s+href=["']([^"']*\/product\/[^"']+)["'][^>]*>([^<]+)<\/a>/gi
        const seen = new Set()

        let match
        while ((match = productLinkRegex.exec(data.result)) !== null) {
            if (products.length >= 5) break
            
            const url = match[1]
            const name = match[2].trim()

            if (!seen.has(url) && name.length > 2) {
                seen.add(url)
                products.push({
                    name: name.substring(0, 100),
                    url: url,
                    price: null,
                    source: 'MedPlus'
                })
            }
        }

        return Response.json({ 
            products: products.slice(0, 5),
            searchQuery: productName,
            searchUrl: searchUrl,
            method: products.length > 0 ? 'regex' : 'none',
            fallback: true
        })

    } catch (error) {
        console.error('Error searching products:', error)
        return Response.json({ 
            products: [],
            error: 'Failed to search for products'
        }, { status: 500 })
    }
}
