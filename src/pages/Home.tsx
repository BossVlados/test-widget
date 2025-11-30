import { observer } from 'mobx-react-lite';
import { Carousel } from 'antd';
import { widgetStore } from '../stores/WidgetStore';
import ProductCard from '../components/ProductCard';

const Home = observer(() => {
  const products = widgetStore.homeProducts;

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-background py-8 animate-fade-in">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Рекомендуемые товары
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Специально подобранные для вас товары с лучшими предложениями
          </p>
        </div>

        {products.length > 0 ? (
          <div className="max-w-7xl mx-auto">
            <Carousel
              autoplay
              autoplaySpeed={3000}
              dots={{ className: 'custom-dots' }}
              slidesToShow={Math.min(5, products.length)}
              responsive={[
                {
                  breakpoint: 1536,
                  settings: {
                    slidesToShow: Math.min(4, products.length),
                  },
                },
                {
                  breakpoint: 1280,
                  settings: {
                    slidesToShow: Math.min(3, products.length),
                  },
                },
                {
                  breakpoint: 768,
                  settings: {
                    slidesToShow: Math.min(2, products.length),
                  },
                },
                {
                  breakpoint: 640,
                  settings: {
                    slidesToShow: 1,
                  },
                },
              ]}
            >
              {products.map((product) => (
                <div key={product.id} className="px-2">
                  <ProductCard product={product} compact />
                </div>
              ))}
            </Carousel>
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-muted-foreground text-lg">Товары не найдены</p>
          </div>
        )}
      </div>

      <style>{`
        .custom-dots li button {
          background: hsl(var(--primary)) !important;
          opacity: 0.3;
        }
        .custom-dots li.slick-active button {
          opacity: 1;
        }
        .slick-slide > div {
          padding: 0 8px;
        }
      `}</style>
    </div>
  );
});

export default Home;
