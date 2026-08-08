import React, { useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';

interface SeoHeadProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  animeData?: any;
}

export const SeoHead: React.FC<SeoHeadProps> = ({
  title = 'AniSenpaiUz - Professional Anime & Manga Platformasi',
  description = 'AniSenpaiUz - O\'zbekistonda professional anime va manga platformasi. Full HD 1080p sifat, O\'zbekcha dublyaj va subtitrlar.',
  keywords = 'AniSenpaiUz, anime uzbekcha, manga uzbekcha, anime subtitr, anime dublyaj, solo leveling uzbekcha, demon slayer, naruto, one piece, anime watch uzbekistan',
  image = 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=1200&q=80',
  url = 'https://anisenpaiuz.com',
  animeData
}) => {
  const { language } = useLanguage();

  useEffect(() => {
    // Dynamic document title
    document.title = title.includes('AniSenpaiUz') ? title : `${title} - AniSenpaiUz`;

    // Helper to update meta tags
    const setMeta = (name: string, content: string, property = false) => {
      const attr = property ? 'property' : 'name';
      let element = document.querySelector(`meta[${attr}="${name}"]`);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attr, name);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    setMeta('description', description);
    setMeta('keywords', keywords);

    // Open Graph
    setMeta('og:title', title, true);
    setMeta('og:description', description, true);
    setMeta('og:image', image, true);
    setMeta('og:url', url, true);
    setMeta('og:site_name', 'AniSenpaiUz', true);
    setMeta('og:type', animeData ? 'video.tv_show' : 'website', true);

    // Twitter
    setMeta('twitter:card', 'summary_large_image');
    setMeta('twitter:title', title);
    setMeta('twitter:description', description);
    setMeta('twitter:image', image);

    // Canonical link
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', url);

    // Schema.org JSON-LD structured data
    let schemaScript = document.getElementById('snpaiuz-schema-json');
    if (!schemaScript) {
      schemaScript = document.createElement('script');
      schemaScript.id = 'snpaiuz-schema-json';
      schemaScript.setAttribute('type', 'application/ld+json');
      document.head.appendChild(schemaScript);
    }

    const jsonLdData = animeData ? {
      '@context': 'https://schema.org',
      '@type': animeData.type === 'Movie' ? 'Movie' : 'TVSeries',
      'name': animeData.title.uz || animeData.title.en,
      'alternateName': [animeData.title.en, animeData.title.jp],
      'description': animeData.synopsis.uz || animeData.synopsis.en,
      'image': animeData.poster,
      'genre': animeData.genres,
      'aggregateRating': {
        '@type': 'AggregateRating',
        'ratingValue': animeData.rating,
        'bestRating': '10',
        'ratingCount': animeData.votesCount
      },
      'productionCompany': {
        '@type': 'Organization',
        'name': animeData.studio
      }
    } : {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      'name': 'AniSenpaiUz',
      'url': 'https://anisenpaiuz.com',
      'potentialAction': {
        '@type': 'SearchAction',
        'target': 'https://anisenpaiuz.com/catalog?search={search_term_string}',
        'query-input': 'required name=search_term_string'
      }
    };

    schemaScript.textContent = JSON.stringify(jsonLdData);
  }, [title, description, keywords, image, url, animeData, language]);

  return null;
};
