import { createRoot } from 'react-dom/client'
import './index.css'
import { widgetStore } from './stores/WidgetStore'
import App from './App.tsx'

interface WidgetConfig {
  el: string;
  dealers?: string[];
}

// Класс виджета для инициализации
class WidgetCatalog {
  private config: WidgetConfig;
  private root: any;

  constructor(config: WidgetConfig) {
    this.config = config;
  }

  run() {
    const element = document.querySelector(this.config.el);
    if (!element) {
      console.error(`Element ${this.config.el} not found`);
      return;
    }

    // Инициализируем store с дилерами
    widgetStore.initialize(this.config.dealers);

    // Рендерим приложение
    this.root = createRoot(element);
    this.root.render(<App />);
  }

  destroy() {
    if (this.root) {
      this.root.unmount();
    }
  }
}

// Экспортируем класс в window
(window as any).WidgetCatalog = WidgetCatalog;

// Для разработки - инициализация при загрузке
if (import.meta.env.DEV) {
  window.addEventListener('load', () => {
    const widget = new WidgetCatalog({
      el: '#root',
      dealers: []
    });
    widget.run();
  });
}
