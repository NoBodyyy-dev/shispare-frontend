import { useEffect } from "react";

interface SEOProps {
    title?: string;
    description?: string;
    keywords?: string;
    image?: string;
    url?: string;
    type?: string;
    siteName?: string;
    locale?: string;
    noindex?: boolean;
    canonical?: string;
}

const defaultTitle = "Shispare - Материалы для строительства и ремонта";
const defaultDescription = "Широкий ассортимент строительных материалов от ведущих производителей. Качественные товары для строительства и ремонта с доставкой по России.";
const defaultImage = "/logo.png";
const defaultUrl = typeof window !== "undefined" ? window.location.origin : "";
const defaultSiteName = "Shispare";

export const SEO: React.FC<SEOProps> = ({
    title,
    description,
    keywords,
    image,
    url,
    type = "website",
    siteName = defaultSiteName,
    locale = "ru_RU",
    noindex = false,
    canonical,
}) => {
    const fullTitle = title ? `${title} | ${defaultSiteName}` : defaultTitle;
    const fullDescription = description || defaultDescription;
    const fullImage = image ? (image.startsWith("http") ? image : `${defaultUrl}${image}`) : `${defaultUrl}${defaultImage}`;
    const fullUrl = url ? (url.startsWith("http") ? url : `${defaultUrl}${url}`) : (typeof window !== "undefined" ? window.location.href : defaultUrl);
    const canonicalUrl = canonical ? (canonical.startsWith("http") ? canonical : `${defaultUrl}${canonical}`) : fullUrl;

    useEffect(() => {
        // Update title
        document.title = fullTitle;

        // Update or create meta tags
        const updateMetaTag = (name: string, content: string, attribute: string = "name") => {
            let element = document.querySelector(`meta[${attribute}="${name}"]`) as HTMLMetaElement;
            if (!element) {
                element = document.createElement("meta");
                element.setAttribute(attribute, name);
                document.head.appendChild(element);
            }
            element.setAttribute("content", content);
        };

        // Basic meta tags
        updateMetaTag("description", fullDescription);
        if (keywords) {
            updateMetaTag("keywords", keywords);
        }

        // Open Graph tags
        updateMetaTag("og:title", fullTitle, "property");
        updateMetaTag("og:description", fullDescription, "property");
        updateMetaTag("og:image", fullImage, "property");
        updateMetaTag("og:url", fullUrl, "property");
        updateMetaTag("og:type", type, "property");
        updateMetaTag("og:site_name", siteName, "property");
        updateMetaTag("og:locale", locale, "property");

        // Twitter Card tags
        updateMetaTag("twitter:card", "summary_large_image");
        updateMetaTag("twitter:title", fullTitle);
        updateMetaTag("twitter:description", fullDescription);
        updateMetaTag("twitter:image", fullImage);

        // Robots
        if (noindex) {
            updateMetaTag("robots", "noindex, nofollow");
        } else {
            updateMetaTag("robots", "index, follow");
        }

        // Canonical URL
        let canonicalLink = document.querySelector("link[rel='canonical']") as HTMLLinkElement;
        if (!canonicalLink) {
            canonicalLink = document.createElement("link");
            canonicalLink.setAttribute("rel", "canonical");
            document.head.appendChild(canonicalLink);
        }
        canonicalLink.setAttribute("href", canonicalUrl);

        // Cleanup function
        return () => {
            // Optionally clean up on unmount if needed
        };
    }, [fullTitle, fullDescription, keywords, fullImage, fullUrl, type, siteName, locale, noindex, canonicalUrl]);

    return null;
};

