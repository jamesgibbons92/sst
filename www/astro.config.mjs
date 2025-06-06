import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";
import sitemap from "@astrojs/sitemap";
import config from "./config";
import sst from "astro-sst";
import { rehypeHeadingIds } from "@astrojs/markdown-remark";
import rehypeAutolinkHeadings from "rehype-autolink-headings";

const sidebar = [
  { label: "Intro", slug: "docs" },
  { label: "Workflow", slug: "docs/workflow" },
  { label: "Enterprise", slug: "docs/enterprise" },
  {
    label: "Get Started",
    collapsed: true,
    items: [
      { label: "Bun", slug: "docs/start/aws/bun" },
      { label: "Nuxt", slug: "docs/start/aws/nuxt" },
      { label: "Solid", slug: "docs/start/aws/solid" },
      { label: "Auth", slug: "docs/start/aws/auth" },
      { label: "Deno", slug: "docs/start/aws/deno" },
      { label: "tRPC", slug: "docs/start/aws/trpc" },
      { label: "Hono", slug: "docs/start/aws/hono" },
      { label: "Astro", slug: "docs/start/aws/astro" },
      { label: "Email", slug: "docs/start/aws/email" },
      { label: "React", slug: "docs/start/aws/react" },
      { label: "Remix", slug: "docs/start/aws/remix" },
      { label: "Svelte", slug: "docs/start/aws/svelte" },
      { label: "Drizzle", slug: "docs/start/aws/drizzle" },
      { label: "Prisma", slug: "docs/start/aws/prisma" },
      { label: "Next.js", slug: "docs/start/aws/nextjs" },
      { label: "Analog", slug: "docs/start/aws/analog" },
      { label: "NestJS", slug: "docs/start/aws/nestjs" },
      { label: "Angular", slug: "docs/start/aws/angular" },
      { label: "Express", slug: "docs/start/aws/express" },
      { label: "Realtime", slug: "docs/start/aws/realtime" },
      { label: "TanStack", slug: "docs/start/aws/tanstack" },
      {
        label: "Cloudflare",
        items: [
          { label: "tRPC", slug: "docs/start/cloudflare/trpc" },
          { label: "Hono", slug: "docs/start/cloudflare/hono" },
          { label: "Worker", slug: "docs/start/cloudflare/worker" },
        ],
      },
    ],
  },
  {
    label: "Concepts",
    items: [
      "docs/live",
      "docs/state",
      "docs/linking",
      "docs/console",
      "docs/providers",
      "docs/components",
    ],
  },
  {
    label: "How to",
    collapsed: true,
    items: [
      { label: "AWS Accounts", slug: "docs/aws-accounts" },
      { label: "IAM Credentials", slug: "docs/iam-credentials" },
      { label: "Migrate From v2", slug: "docs/migrate-from-v2" },
      { label: "Custom Domains", slug: "docs/custom-domains" },
      { label: "Import Resources", slug: "docs/import-resources" },
      { label: "Set up a Monorepo", slug: "docs/set-up-a-monorepo" },
      { label: "Configure a Router", slug: "docs/configure-a-router" },
      { label: "Share Across Stages", slug: "docs/share-across-stages" },
      { label: "Reference Resources", slug: "docs/reference-resources" },
      { label: "Environment Variables", slug: "docs/environment-variables" },
    ],
  },
  {
    label: "Components",
    items: [
      {
        label: "AWS",
        collapsed: true,
        items: [
          "docs/component/aws/efs",
          "docs/component/aws/bus",
          "docs/component/aws/vpc",
          "docs/component/aws/task",
          "docs/component/aws/cron",
          "docs/component/aws/auth",
          "docs/component/aws/nuxt",
          "docs/component/aws/astro",
          "docs/component/aws/redis",
          "docs/component/aws/email",
          "docs/component/aws/react",
          "docs/component/aws/mysql",
          "docs/component/aws/remix",
          "docs/component/aws/nextjs",
          "docs/component/aws/queue",
          "docs/component/aws/vector",
          "docs/component/aws/aurora",
          "docs/component/aws/router",
          "docs/component/aws/analog",
          "docs/component/aws/bucket",
          "docs/component/aws/cluster",
          "docs/component/aws/service",
          "docs/component/aws/dynamo",
          "docs/component/aws/realtime",
          "docs/component/aws/sns-topic",
          "docs/component/aws/function",
          "docs/component/aws/postgres",
          "docs/component/aws/app-sync",
          "docs/component/aws/svelte-kit",
          "docs/component/aws/static-site",
          "docs/component/aws/solid-start",
          "docs/component/aws/open-search",
          "docs/component/aws/opencontrol",
          "docs/component/aws/tan-stack-start",
          "docs/component/aws/kinesis-stream",
          "docs/component/aws/apigatewayv1",
          "docs/component/aws/apigatewayv2",
          "docs/component/aws/step-functions",
          "docs/component/aws/cognito-user-pool",
          "docs/component/aws/cognito-identity-pool",
          "docs/component/aws/apigateway-websocket",
          {
            label: "Internal",
            collapsed: true,
            items: [
              "docs/component/aws/cdn",
              "docs/component/aws/app-sync-resolver",
              "docs/component/aws/app-sync-function",
              "docs/component/aws/bucket-notification",
              "docs/component/aws/app-sync-data-source",
              "docs/component/aws/apigatewayv1-api-key",
              "docs/component/aws/bus-queue-subscriber",
              "docs/component/aws/cognito-user-pool-client",
              "docs/component/aws/bus-lambda-subscriber",
              "docs/component/aws/apigatewayv2-url-route",
              "docs/component/aws/apigatewayv1-authorizer",
              "docs/component/aws/apigatewayv1-usage-plan",
              "docs/component/aws/apigatewayv2-authorizer",
              "docs/component/aws/queue-lambda-subscriber",
              "docs/component/aws/sns-topic-queue-subscriber",
              "docs/component/aws/dynamo-lambda-subscriber",
              "docs/component/aws/realtime-lambda-subscriber",
              "docs/component/aws/sns-topic-lambda-subscriber",
              "docs/component/aws/apigatewayv1-lambda-route",
              "docs/component/aws/apigatewayv2-lambda-route",
              "docs/component/aws/apigateway-websocket-route",
              "docs/component/aws/providers/function-environment-update",
              "docs/component/aws/apigatewayv1-integration-route",
              "docs/component/aws/kinesis-stream-lambda-subscriber",
              {
                label: "StepFunctions",
                collapsed: true,
                items: [
                  {
                    label: "Fail",
                    slug: "docs/component/aws/step-functions/fail",
                  },
                  {
                    label: "Map",
                    slug: "docs/component/aws/step-functions/map",
                  },
                  {
                    label: "Wait",
                    slug: "docs/component/aws/step-functions/wait",
                  },
                  {
                    label: "Task",
                    slug: "docs/component/aws/step-functions/task",
                  },
                  {
                    label: "Pass",
                    slug: "docs/component/aws/step-functions/pass",
                  },
                  {
                    label: "State",
                    slug: "docs/component/aws/step-functions/state",
                  },
                  {
                    label: "Choice",
                    slug: "docs/component/aws/step-functions/choice",
                  },
                  {
                    label: "Parallel",
                    slug: "docs/component/aws/step-functions/parallel",
                  },
                  {
                    label: "Succeed",
                    slug: "docs/component/aws/step-functions/succeed",
                  },
                ],
              },
            ],
          },
          {
            label: "Deprecated",
            collapsed: true,
            items: [
              { label: "Vpc.v1", slug: "docs/component/aws/vpc-v1" },
              { label: "Redis.v1", slug: "docs/component/aws/redis-v1" },
              { label: "Service.v1", slug: "docs/component/aws/service-v1" },
              { label: "Cluster.v1", slug: "docs/component/aws/cluster-v1" },
              { label: "Postgres.v1", slug: "docs/component/aws/postgres-v1" },
            ],
          },
        ],
      },
      {
        label: "Cloudflare",
        collapsed: true,
        items: [
          "docs/component/cloudflare/kv",
          "docs/component/cloudflare/d1",
          "docs/component/cloudflare/worker",
          "docs/component/cloudflare/bucket",
        ],
      },
      {
        label: "Internal",
        collapsed: true,
        items: [
          {
            label: "Dns",
            items: [
              { label: "AWS", slug: "docs/component/aws/dns" },
              { label: "Vercel", slug: "docs/component/vercel/dns" },
              { label: "Cloudflare", slug: "docs/component/cloudflare/dns" },
            ],
          },
          {
            label: "Linkable",
            items: [
              { label: "binding", slug: "docs/component/cloudflare/binding" },
              { label: "permission", slug: "docs/component/aws/permission" },
            ],
          },
        ],
      },
      "docs/all-providers",
    ],
  },
  {
    label: "Reference",
    collapsed: true,
    items: [
      "docs/reference/cli",
      "docs/reference/sdk",
      "docs/reference/global",
      "docs/reference/config",
      "docs/component/secret",
      "docs/component/linkable",
      "docs/component/experimental/dev-command",
    ],
  },
  { label: "Examples", slug: "docs/examples" },
  { label: "Common Errors", slug: "docs/common-errors" },
];

if (import.meta.env.DEV) {
  sidebar.push({
    label: "Dummy",
    items: [{ slug: "dummy/tsdoc" }, { slug: "dummy/markdown" }],
  });
}

// https://astro.build/config
export default defineConfig({
  site: "https://sst.dev",
  adapter: sst(),
  server: {
    host: "0.0.0.0",
  },
  prefetch: import.meta.env.DEV ? false : true,
  devToolbar: {
    enabled: false,
  },
  redirects: {
    "/install": "https://raw.githubusercontent.com/sst/sst/dev/install",
    "/discord": "https://discord.gg/sst",
    "/guide": "https://guide.sst.dev",
    "/docs/start/aws/container": "/docs/start/aws/express",
  },
  integrations: [
    sitemap({
      filter: (page) => !page.includes("/dummy/"),
    }),
    starlight({
      title: "SST",
      logo: {
        light: "./src/assets/logo-light.svg",
        dark: "./src/assets/logo-dark.svg",
        replacesTitle: true,
      },
      lastUpdated: true,
      favicon: "/favicon.svg",
      pagination: false,
      markdown: {
        // Use custom heading links
        headingLinks: false,
      },
      customCss: [
        "@fontsource-variable/rubik",
        "@fontsource-variable/roboto-mono",
        "@fontsource/ibm-plex-mono/400.css",
        "@fontsource/ibm-plex-mono/400-italic.css",
        "@fontsource/ibm-plex-mono/500.css",
        "@fontsource/ibm-plex-mono/600.css",
        "@fontsource/ibm-plex-mono/700.css",
        "./src/custom.css",
        "./src/styles/splash.css",
        "./src/styles/lander.css",
        "./src/styles/markdown.css",
        "./src/styles/tsdoc.css",
        "./src/styles/heading.css",
      ],
      social: [
        { icon: "discord", label: "Discord", href: config.discord },
        { icon: "github", label: "GitHub", href: config.github },
        { icon: "twitter", label: "X.com", href: config.twitter },
      ],
      editLink: {
        baseUrl: "https://github.com/sst/sst/edit/dev/www",
      },
      components: {
        Hero: "./src/components/Hero.astro",
        Head: "./src/components/Head.astro",
        Header: "./src/components/Header.astro",
        Footer: "./src/components/Footer.astro",
        PageTitle: "./src/components/PageTitle.astro",
        MobileMenuFooter: "./src/components/MobileMenuFooter.astro",
      },
      head: [
        {
          tag: "script",
          attrs: {
            src: "https://widget.kapa.ai/kapa-widget.bundle.js",
            "data-website-id": "6853540a-5c1e-4de3-9e2f-b893b6b825a8",
            "data-project-name": "SST",
            "data-project-color": "#E27152",
            "data-modal-header-bg-color": "white",
            "data-button-hide": "true",
            "data-modal-title": "Ask AI",
            "data-font-family": "var(--__sl-font)",
            "data-modal-title-font-family": "var(--__sl-font-headings)",
            "data-modal-border-radius": "0.625rem",
            "data-modal-example-questions":
              "How do I deploy a Next.js app?,How do I set a secret?,How do I link resources together?,How do I set a custom domain for my API?",
            "data-modal-override-open-class": "kapa-modal-open",
            "data-project-logo": "/logo-square.png",
            async: true,
          },
        },
        // Add ICO favicon fallback for Safari
        {
          tag: "link",
          attrs: {
            rel: "icon",
            href: "/favicon.ico",
            sizes: "32x32",
          },
        },
        // Add light/dark mode favicon
        {
          tag: "link",
          attrs: {
            rel: "icon",
            href: "/favicon.svg",
            media: "(prefers-color-scheme: light)",
          },
        },
        {
          tag: "link",
          attrs: {
            rel: "icon",
            href: "/favicon.svg",
            media: "(prefers-color-scheme: dark)",
          },
        },
      ],
      sidebar,
    }),
  ],
  markdown: {
    rehypePlugins: [
      rehypeHeadingIds,
      [
        rehypeAutolinkHeadings,
        {
          behavior: "wrap",
        },
      ],
    ],
  },
});
