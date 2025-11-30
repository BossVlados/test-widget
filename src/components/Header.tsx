import { observer } from 'mobx-react-lite';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingCartOutlined, HomeOutlined, AppstoreOutlined } from '@ant-design/icons';
import { Badge } from 'antd';
import { widgetStore } from '../stores/WidgetStore';

const Header = observer(() => {
  const location = useLocation();
  const cartCount = widgetStore.cartItemsCount;

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-card shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link 
            to="/" 
            className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent hover:opacity-80 transition-opacity"
          >
            ShopWidget
          </Link>

          <nav className="flex items-center gap-6">
            <Link
              to="/"
              className={`flex items-center gap-2 transition-colors ${
                isActive('/') 
                  ? 'text-primary font-medium' 
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <HomeOutlined />
              <span className="hidden sm:inline">Главная</span>
            </Link>

            <Link
              to="/catalog"
              className={`flex items-center gap-2 transition-colors ${
                isActive('/catalog') 
                  ? 'text-primary font-medium' 
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <AppstoreOutlined />
              <span className="hidden sm:inline">Каталог</span>
            </Link>

            <Link
              to="/cart"
              className={`flex items-center gap-2 transition-colors ${
                isActive('/cart') 
                  ? 'text-primary font-medium' 
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Badge count={cartCount} offset={[0, 0]} showZero={false}>
                <ShoppingCartOutlined className="text-lg" />
              </Badge>
              <span className="hidden sm:inline">Корзина</span>
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
});

export default Header;
