import { observer } from 'mobx-react-lite';
import { Card, Button } from 'antd';
import { ShoppingCartOutlined, PlusOutlined, MinusOutlined } from '@ant-design/icons';
import { Product } from '../types/product';
import { widgetStore } from '../stores/WidgetStore';
import { getImageUrl, handleImageError } from '../lib/imageUtils';

interface ProductCardProps {
  product: Product;
  compact?: boolean;
}

const ProductCard = observer(({ product, compact = false }: ProductCardProps) => {
  const isInCart = widgetStore.isInCart(product.id);
  const quantity = widgetStore.getCartQuantity(product.id);

  const dealer = widgetStore.dealers.find(d => d.id === product.dealer);

  const hexToRgba = (hex: string, alpha: number = 1) => {
    if (!hex || typeof hex !== 'string' || hex.length < 6) {
      return `rgba(59, 130, 246, ${alpha})`;
    }
    
    const hexColor = hex.length === 8 ? hex.slice(0, 6) : hex;
    
    try {
      const r = parseInt(hexColor.slice(0, 2), 16);
      const g = parseInt(hexColor.slice(2, 4), 16);
      const b = parseInt(hexColor.slice(4, 6), 16);
      
      return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    } catch (error) {
      return `rgba(59, 130, 246, ${alpha})`;
    }
  };

  // Функция для получения чистого hex цвета
  const getPureHex = (hex: string) => {
    if (!hex || typeof hex !== 'string' || hex.length < 6) {
      return '#3b82f6';
    }
    const hexColor = hex.length === 8 ? hex.slice(0, 6) : hex;
    return `#${hexColor}`;
  };

  const handleAddToCart = () => {
    widgetStore.addToCart(product);
  };

  const handleIncrement = () => {
    widgetStore.addToCart(product);
  };

  const handleDecrement = () => {
    widgetStore.removeOneFromCart(product.id);
  };

  const dealerColor = dealer?.name;
  const pureHex = getPureHex(dealerColor);

  return (
    <Card
      hoverable
      className="h-full transition-all duration-300 hover:shadow-lg"
      cover={
        <div className="relative overflow-hidden bg-muted">
          <img
            alt={product.name}
            src={getImageUrl(product.image)}
            className="h-48 w-full object-cover transition-transform duration-300 hover:scale-110"
            onError={handleImageError}
          />
          <div 
            className="absolute top-2 right-2 px-3 py-1.5 rounded-md text-xs font-medium 
                     flex items-center gap-2 shadow-sm"
            style={{
              backgroundColor: hexToRgba(dealerColor, 0.15),
              color: pureHex,
              border: `1px solid ${hexToRgba(dealerColor, 0.3)}`
            }}
          >
            <div 
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: pureHex }}
            />
            {product.dealer}
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
