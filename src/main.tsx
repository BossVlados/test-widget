import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { widgetStore } from "./stores/WidgetStore";

interface WidgetConfig {
  el: string;
  dealers?: string[];
}

declare global {
  interface Window {
    WidgetCatalog: typeof WidgetCatalog;
  }
}

class WidgetCatalog {
  private config: WidgetConfig;
  private root: ReturnType<typeof createRoot> | null = null;

  constructor(config: WidgetConfig) {
    this.config = config;
  }

  async run() {
    const element = document.querySelector(this.config.el);
    if (!element) {
      console.error(`Element ${this.config.el} not found`);
      return;
    }

    await widgetStore.initialize(this.config.dealers);

    this.root = createRoot(element);
    this.root.render(<App />);
  }

  destroy() {
    if (this.root) {
      this.root.unmount();
    }
  }
}

window.WidgetCatalog = WidgetCatalog;

window.addEventListener('load', () => {
  const widget = new WidgetCatalog({
    el: '#root',
    dealers: []
  });
  widget.run();
});
