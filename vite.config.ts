import { paraglideVitePlugin } from "@inlang/paraglide-js";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import tailwindcss from "@tailwindcss/vite";
import fs from "fs";
import path from "path";
import { defineConfig, type Plugin } from "vite";

function localizedHtmlSeoPlugin(): Plugin {
  const LOCALE_META = [
    {
      locale: "en",
      dir: "",
      url: "https://chessin.org/",
      ogLocale: "en_US",
    },
    {
      locale: "es",
      dir: "es",
      url: "https://chessin.org/es/",
      ogLocale: "es_ES",
    },
    {
      locale: "ja",
      dir: "ja",
      url: "https://chessin.org/ja/",
      ogLocale: "ja_JP",
    },
    {
      locale: "ru",
      dir: "ru",
      url: "https://chessin.org/ru/",
      ogLocale: "ru_RU",
    },
    {
      locale: "de",
      dir: "de",
      url: "https://chessin.org/de/",
      ogLocale: "de_DE",
    },
    {
      locale: "fr",
      dir: "fr",
      url: "https://chessin.org/fr/",
      ogLocale: "fr_FR",
    },
  ] as const;

  const hreflangTags = [
    ...LOCALE_META.map(
      (l) => `    <link rel="alternate" hreflang="${l.locale}" href="${l.url}" />`,
    ),
    `    <link rel="alternate" hreflang="x-default" href="https://chessin.org/" />`,
  ].join("\n");

  return {
    name: "localized-html-seo",
    closeBundle() {
      const distDir = path.resolve("./dist");
      const baseHtmlPath = path.join(distDir, "index.html");
      if (!fs.existsSync(baseHtmlPath)) return;

      const baseHtml = fs.readFileSync(baseHtmlPath, "utf8");
      const enMsgs = JSON.parse(fs.readFileSync(path.resolve("./messages/en.json"), "utf8"));

      for (const item of LOCALE_META) {
        const msgs = JSON.parse(
          fs.readFileSync(path.resolve(`./messages/${item.locale}.json`), "utf8"),
        );

        let html = baseHtml
          .replace('<html lang="en"', `<html lang="${item.locale}"`)
          .replaceAll(enMsgs.seo_title, msgs.seo_title)
          .replaceAll(enMsgs.seo_description, msgs.seo_description)
          .replace('property="og:url" content="https://chessin.org/"', `property="og:url" content="${item.url}"`)
          .replace('"url": "https://chessin.org/",', `"url": "${item.url}",`)
          .replace('content="en_US"', `content="${item.ogLocale}"`)
          .replace('"inLanguage": "en"', `"inLanguage": "${item.locale}"`)
          .replace(
            `<link rel="canonical" href="https://chessin.org/" />`,
            `<link rel="canonical" href="${item.url}" />\n${hreflangTags}`,
          );

        const outPath = item.dir
          ? path.join(distDir, item.dir, "index.html")
          : baseHtmlPath;
        fs.mkdirSync(path.dirname(outPath), { recursive: true });
        fs.writeFileSync(outPath, html);
      }
    },
  };
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    paraglideVitePlugin({
      project: "./project.inlang",
      outdir: "./src/lib/paraglide",
      disableAsyncLocalStorage: true,
      strategy: ["url", "localStorage", "preferredLanguage", "baseLocale"],
      urlPatterns: [
        {
          pattern: "/:path(.*)?",
          localized: [
            ["es", "/es/:path(.*)?"],
            ["ja", "/ja/:path(.*)?"],
            ["ru", "/ru/:path(.*)?"],
            ["de", "/de/:path(.*)?"],
            ["fr", "/fr/:path(.*)?"],
            ["en", "/:path(.*)?"],
          ],
        },
      ],
    }),
    tailwindcss(),
    svelte(),
    localizedHtmlSeoPlugin(),
  ],
  resolve: {
    alias: {
      $lib: path.resolve("./src/lib"),
    },
  },
});
