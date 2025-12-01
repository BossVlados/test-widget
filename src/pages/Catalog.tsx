import { observer } from 'mobx-react-lite';
import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Button, Tag } from 'antd';
import { ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';
import { widgetStore } from '../stores/WidgetStore';
import ProductCard from '../components/ProductCard';
import { SortOrder } from '../types/product';

const Catalog = observer(() => {
  const [searchParams, setSearchParams] = useSearchParams();
  const products = widgetStore.filteredProducts;
  const dealers = widgetStore.dealers;

  useEffect(() => {
    const dealersParam = searchParams.get('dealers');
    const sortParam = searchParams.get('sort') as SortOrder;
    
    const dealerIds = dealersParam ? dealersParam.split(',') : [];
    const sort = sortParam || 'none';
    
    widgetStore.setFiltersFromUrl(dealerIds, sort);
  }, []);

  useEffect(() => {
    const params = new URLSearchParams();
    
    if (widgetStore.selectedDealers.length > 0) {
      params.set('dealers', widgetStore.selectedDealers.join(','));
    }
    
    if (widgetStore.sortOrder !== 'none') {
      params.set('sort', widgetStore.sortOrder);
    }
    
    setSearchParams(params, { replace: true });
  }, [widgetStore.selectedDealers, widgetStore.sortOrder, setSearchParams]);

  const handleDealerToggle = (dealerId: string) => {
    widgetStore.toggleDealerFilter(dealerId);
  };

  const handleSortToggle = () => {
    const orders: SortOrder[] = ['none', 'asc', 'desc'];
    const currentIndex = orders.indexOf(widgetStore.sortOrder);
    const nextIndex = (currentIndex + 1) % orders.length;
    widgetStore.setSortOrder(orders[nextIndex]);
  };

  const getSortIcon = () => {
    if (widgetStore.sortOrder === 'asc') return <ArrowUpOutlined />;
    if (widgetStore.sortOrder === 'desc') return <ArrowDownOutlined />;
    return null;
  };

  const getSortLabel = () => {
    if (widgetStore.sortOrder === 'asc') return 'По возрастанию';
    if (widgetStore.sortOrder === 'desc') return 'По убыванию';
    return 'Сортировка';
  };

  const hexToRgba = (hex: string, alpha: number = 1) => {
    if (!hex || typeof hex !== 'string' || hex.length < 6) {
      return `rgba(59, 130, 246, ${alpha})`;
    }
    
    // Если hex содержит 8 символов (включая альфа), берем первые 6
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

  // Функция для получения чистого hex цвета (без альфа канала)
  const getPureHex = (hex: string) => {
    if (!hex || typeof hex !== 'string' || hex.length < 6) {
      return '#3b82f6'; // синий по умолчанию
    }
    const hexColor = hex.length === 8 ? hex.slice(0, 6) : hex;
    return `#${hexColor}`;
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-background py-8 animate-fade-in">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl md:text-4xl font-bold mb-8 text-foreground">
          Каталог товаров
        </h1>

        {/* Фильтры */}
        <div className="mb-8 space-y-4 animate-slide-up">
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-3">
              Фильтр по дилерам:
            </h3>
            <div className="flex flex-wrap gap-2">
              {dealers.map((dealer) => {
                if (!dealer || !dealer.id) return null;
                const isSelected = widgetStore.selectedDealers.includes(dealer.id);
                const dealerColorHex = dealer.name;
                const pureHex = getPureHex(dealerColorHex);
                
                return (
                  <Tag.CheckableTag
                    key={dealer.id}
                    checked={isSelected}
                    onChange={() => handleDealerToggle(dealer.id)}
                    className="cursor-pointer px-4 py-2 rounded-full border-2 transition-all font-medium"
                    style={{
                      backgroundColor: isSelected 
                        ? hexToRgba(dealerColorHex, 0.15)
                        : 'transparent',
                      borderColor: isSelected
                        ? pureHex
                        : hexToRgba(dealerColorHex, 0.3),
                      color: pureHex,
                      fontWeight: isSelected ? '600' : '400'
                    }}
                  >
                    {dealer.id.replace('dealer_', '')}
                  </Tag.CheckableTag>
                );
              })}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-3">
              Сортировка по цене:
            </h3>
            <Button
              onClick={handleSortToggle}
              icon={getSortIcon()}
              type={widgetStore.sortOrder !== 'none' ? 'primary' : 'default'}
              className={widgetStore.sortOrder !== 'none' ? 'bg-primary' : ''}
            >
              {getSortLabel()}
            </Button>
          </div>
        </div>

        {/* Товары */}
        {products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <div key={product.id} className="animate-scale-in">
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-muted-foreground text-lg">
              Товары не найдены. Попробуйте изменить фильтры.
            </p>
          </div>
        )}
      </div>
    </div>
  );
});

export default Catalog;