import React from 'react'
import { ShoppingCart, ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function ProductRecommendations({ products }) {
    if (!products || products.length === 0) {
        return null
    }

    return (
        <div className='mt-4 pt-4 border-t border-border'>
            <div className='flex items-center gap-2 mb-3'>
                <ShoppingCart className='w-4 h-4 text-primary' />
                <h4 className='font-semibold text-sm text-foreground'>Recommended Products</h4>
            </div>
            
            <div className='space-y-2'>
                {products.map((product, index) => (
                    <a
                        key={index}
                        href={product.url}
                        target='_blank'
                        rel='noopener noreferrer'
                        className='block p-3 bg-muted/30 hover:bg-muted/50 rounded-lg transition-colors group'
                    >
                        <div className='flex items-start justify-between gap-3'>
                            <div className='flex-1 min-w-0'>
                                <p className='font-medium text-sm text-foreground group-hover:text-primary truncate'>
                                    {product.name}
                                </p>
                                {product.price && (
                                    <p className='text-xs text-muted-foreground mt-1'>
                                        ₦{product.price}
                                    </p>
                                )}
                                <p className='text-xs text-muted-foreground mt-1 opacity-70'>
                                    {product.source}
                                </p>
                            </div>
                            <ExternalLink className='w-4 h-4 text-muted-foreground group-hover:text-primary flex-shrink-0 mt-0.5' />
                        </div>
                    </a>
                ))}
            </div>
        </div>
    )
}
