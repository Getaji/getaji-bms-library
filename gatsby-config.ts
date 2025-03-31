import type { GatsbyConfig } from "gatsby"

const config: GatsbyConfig = {
  siteMetadata: {
    siteUrl: `https://getaji-bms-library.pages.dev`,
  },
  // More easily incorporate content into your pages through automatic TypeScript type generation and better GraphQL IntelliSense.
  // If you use VSCode you can also use the GraphQL plugin
  // Learn more at: https://gatsby.dev/graphql-typegen
  graphqlTypegen: true,
  plugins: [
    "gatsby-plugin-pnpm",
    "gatsby-plugin-react-helmet",
    "gatsby-plugin-remove-generator",
    "gatsby-plugin-loadable-components-ssr",
    "gatsby-transformer-json",
    `gatsby-transformer-remark`,
    {
      resolve: `gatsby-source-sqlite`,
      options: {
        fileName: './src/content/data.db',
        queries: [
          {
            statement: 'SELECT * FROM data',
            idFieldName: 'sha256',
            name: 'data'
          }
        ]
      }
    },
    {
      resolve: "gatsby-source-filesystem",
      options: {
        path: "./src/content/",
      },
    },
    "local-plugin",
  ],
};

export default config;
