import type { Preview } from "@storybook/react";
import "../styles/globals.css";

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    backgrounds: {
      default: "light",
      values: [
        { name: "light", value: "#ffffff" },
        { name: "dark", value: "#0a0a0a" },
      ],
    },
    layout: "centered",
  },
  decorators: [
    (Story, context) => {
      const isDark = context.globals.backgrounds?.value === "#0a0a0a";
      return (
        <div className={isDark ? "dark" : ""}>
          <div className="bg-background text-foreground p-8">
            <Story />
          </div>
        </div>
      );
    },
  ],
};

export default preview;
