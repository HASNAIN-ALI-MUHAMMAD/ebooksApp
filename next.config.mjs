/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode:true,
    experimental:{
        outputFileTracingIncludes:{
            'api/process/pdf':[
                 './node_modules/pdfjs-dist/build/pdf.worker.js',
                 './node_modules/pdfjs-dist/package.json',
            ],
        }
    },
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
