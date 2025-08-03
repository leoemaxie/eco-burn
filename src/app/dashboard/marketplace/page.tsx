import Image from 'next/image';
import { PageHeader } from '@/components/page-header';
import { products } from '@/lib/data';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ShoppingCart } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function MarketplacePage() {
  return (
    <>
      <PageHeader
        title="Marketplace"
        description="Buy and sell upcycled products and spare parts."
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <Card key={product.id} className="overflow-hidden group">
            <CardContent className="p-0">
              <div className="aspect-square relative">
                <Image
                  src={product.imageUrl}
                  alt={product.name}
                  layout="fill"
                  objectFit="cover"
                  className="transition-transform group-hover:scale-105"
                  data-ai-hint="upcycled product"
                />
                 <div className="absolute top-2 right-2">
                    <Badge variant="destructive">{`$${product.price.toFixed(2)}`}</Badge>
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-headline font-semibold truncate">
                  {product.name}
                </h3>
                <p className="text-sm text-muted-foreground">
                  by {product.seller}
                </p>
              </div>
            </CardContent>
            <CardFooter className="p-4 pt-0">
              <Button className="w-full bg-accent hover:bg-accent/90">
                <ShoppingCart className="mr-2 h-4 w-4" />
                Add to Cart
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </>
  );
}
