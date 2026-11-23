module.exports = {
  content: ["./app/**/*.js", "./components/**/*.js"],
  theme: {
    extend: {
      fontFamily: { sans: ["var(--f)", "system-ui", "sans-serif"] },
      colors: {
        ink: "#0F2A2E",
        amber: { DEFAULT: "#E9A23B", dark: "#B87510" },
        paper: "#F4F5F2",
      },
      keyframes: {
        slideIn: {
          from: { transform: "translateX(100%)" },
          to: { transform: "none" },
        },
        view: {
          from: { opacity: 0, transform: "translateX(28px)" },
          to: { opacity: 1, transform: "none" },
        },
        fade: { from: { opacity: 0 }, to: { opacity: 1 } },
      },
      animation: {
        slideIn: "slideIn .3s cubic-bezier(.2,.8,.2,1)",
        view: "view .35s cubic-bezier(.2,.8,.2,1)",
        fade: "fade .2s",
      },
    },
  },
  plugins: [],
};
