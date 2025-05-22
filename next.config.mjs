/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode:true,
     webpack: (config, { isServer }) => {
    if (isServer) {
      if (!config.externals) {
        config.externals = [];
      }
      config.externals.push('pdfjs-dist');
    }
    return config;
  },
    images:{
        remotePatterns:[
            {
                protocol: 'https',
                hostname: 'avatars.githubusercontent.com',
            },
            {
                protocol:'https',
                hostname:'lh3.googleusercontent.com'
            }
        ]
    }
};


export default nextConfig;
