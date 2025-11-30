import { observer } from 'mobx-react-lite';
import { Card, Button } from 'antd';
import { ShoppingCartOutlined, PlusOutlined, MinusOutlined } from '@ant-design/icons';
import { Product } from '../types/product';
import { widgetStore } from '../stores/WidgetStore';

interface ProductCardProps {
  product: Product;
  compact?: boolean;
}

const ProductCard = observer(({ product, compact = false }: ProductCardProps) => {
  const isInCart = widgetStore.isInCart(product.id);
  const quantity = widgetStore.getCartQuantity(product.id);

  const handleAddToCart = () => {
    widgetStore.addToCart(product);
  };

  const handleIncrement = () => {
    widgetStore.addToCart(product);
  };

  const handleDecrement = () => {
    widgetStore.removeOneFromCart(product.id);
  };

  return (
    <Card
      hoverable
      className="h-full transition-all duration-300 hover:shadow-lg"
      cover={
        <div className="relative overflow-hidden bg-muted">
          <img
            alt={product.name}
            src={product.picture}
            className="h-48 w-full object-cover transition-transform duration-300 hover:scale-110"
          />
          <div className="absolute top-2 right-2 bg-primary text-primary-foreground px-2 py-1 rounded text-xs font-medium">
            {widgetStore.dealers.find(d => d.id === product.dealer)?.name || product.dealer}
          </div>
        </div>
      }
    >
      <div className="flex flex-col h-full">
        <h3 className={`font-semibold text-foreground mb-2 ${compact ? 'text-sm' : 'text-base'} line-clamp-2`}>
          {product.name}
        </h3>
        
        <div className="mt-auto">
          <p className={`font-bold text-primary mb-3 ${compact ? 'text-lg' : 'text-xl'}`}>
            {product.price.toLocaleString('ru-RU')} ₽
          </p>

          {!isInCart ? (
            <Button
              type="primary"
              icon={<ShoppingCartOutlined />}
              onClick={handleAddToCart}
              className="w-full bg-gradient-to-r from-accent to-accent hover:opacity-90"
              size={compact ? 'middle' : 'large'}
            >
              В корзину
            </Button>
          ) : (
            <div className="flex items-center justify-between gap-2">
              <Button
                icon={<MinusOutlined />}
                onClick={handleDecrement}
                size={compact ? 'middle' : 'large'}
                className="flex-shrink-0"
              />
              <span className="font-semibold text-lg px-4">{quantity}</span>
              <Button
                icon={<PlusOutlined />}
                onClick={handleIncrement}
                size={compact ? 'middle' : 'large'}
                className="flex-shrink-0"
              />
            </div>
          )}
        </div>
      </div>
    </Card>
  );
});

export default ProductCard;
