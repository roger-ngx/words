module.exports = {
  async rewrites() {
      return [
        {
          // matching all API routes
          source: "/api/:path*",
          destination: "https://words-gamma.vercel.app/api/:path*"
        }
      ]
    }
};