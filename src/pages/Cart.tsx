import { observer } from 'mobx-react-lite';
import { Button, Card, Empty } from 'antd';
import { DeleteOutlined, PlusOutlined, MinusOutlined, ShoppingOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { widgetStore } from '../stores/WidgetStore';
import { getImageUrl, handleImageError } from '../lib/imageUtils';

const Cart = observer(() => {
  const cart = widgetStore.cart;
  const total = widgetStore.cartTotal;

  const handleRemoveItem = (productId: number) => {
    widgetStore.removeFromCart(productId);
  };

  const handleClearCart = () => {
    widgetStore.clearCart();
  };

  const handleIncrement = (productId: number) => {
    const product = widgetStore.products.find(p => p.id === productId);
    if (product) {
      widgetStore.addToCart(product);
    }
  };

  const handleDecrement = (productId: number) => {
    widgetStore.removeOneFromCart(productId);
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-[calc(100vh-4rem)] bg-background py-8 flex items-center justify-center animate-fade-in">
        <div className="text-center max-w-md mx-auto px-4">
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description={
              <span className="text-muted-foreground text-lg">
                Корзина пуста
              </span>
            }
          >
            <Link to="/catalog">
              <Button type="primary" icon={<ShoppingOutlined />} size="large" className="bg-primary">
                Перейти в каталог
              </Button>
            </Link>
          </Empty>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-background py-8 animate-fade-in">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground">
            Корзина
          </h1>
          <Button
            danger
            icon={<DeleteOutlined />}
            onClick={handleClearCart}
          >
            Очистить всё
          </Button>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Список товаров */}
          <div className="lg:col-span-2 space-y-4">
            {cart.map((item) => (
              <Card
                key={item.id}
                className="transition-all duration-300 hover:shadow-md animate-slide-up"
              >
                <div className="flex flex-col sm:flex-row gap-4">
                  <img
                    src={getImageUrl(item.image)}
                    alt={item.name}
                    className="w-full sm:w-32 h-32 object-cover rounded"
                    onError={handleImageError}
                  />
                  
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-semibold text-lg text-foreground mb-1">
                          {item.name}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {widgetStore.dealers.find(d => d.id === item.dealer)?.name || item.dealer}
                        </p>
                      </div>
                      <Button
                        type="text"
                        danger
                        icon={<DeleteOutlined />}
                        onClick={() => handleRemoveItem(item.id)}
                      />
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mt-4">
                      <div className="flex items-center gap-2">
                        <Button
                          icon={<MinusOutlined />}
                          onClick={() => handleDecrement(item.id)}
                        />
                        <span className="font-semibold text-lg px-4">
                          {item.quantity}
                        </span>
                        <Button
                          icon={<PlusOutlined />}
                          onClick={() => handleIncrement(item.id)}
                        />
                      </div>

                      <div className="text-right">
                        <p className="text-sm text-muted-foreground">
                          {item.price.toLocaleString('ru-RU')} ₽ × {item.quantity}
                        </p>
                        <p className="text-xl font-bold text-primary">
                          {(item.price * item.quantity).toLocaleString('ru-RU')} ₽
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Итоги */}
          <div className="lg:col-span-1">
            <Card className="sticky top-20 animate-scale-in">
              <h2 className="text-xl font-bold mb-6 text-foreground">
                Итого
              </h2>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-muted-foreground">
                  <span>Товаров:</span>
                  <span>{widgetStore.cartItemsCount} шт.</span>
                </div>
                
                <div className="border-t border-border pt-3">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-foreground">Сумма:</span>
                    <span className="text-2xl font-bold text-primary">
                      {total.toLocaleString('ru-RU')} ₽
                    </span>
                  </div>
                </div>
              </div>

              <Button
                type="primary"
                size="large"
                className="w-full bg-gradient-to-r from-accent to-accent hover:opacity-90"
                onClick={() => alert('Оформление заказа')}
              >
                Оформить заказ
              </Button>

              <div className="mt-4 text-center">
                <Link to="/catalog" className="text-primary hover:underline">
                  Продолжить покупки
                </Link>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
});

export default Cart;