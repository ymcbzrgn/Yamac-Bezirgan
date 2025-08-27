import { useEffect } from 'react';

const SEO = ({ title, description, keywords, image }) => {
  useEffect(() => {
    if (title) {
      document.title = title;
    }
    
    const setMetaTag = (name, content, isProperty = false) => {
      const attribute = isProperty ? 'property' : 'name';
      let tag = document.querySelector(`meta[${attribute}="${name}"]`);
      if (!tag) {
        tag = document.createElement('meta');
        tag.setAttribute(attribute, name);
        document.head.appendChild(tag);
      }
      tag.setAttribute('content', content);
    };
    
    if (description) {
      setMetaTag('description', description);
      setMetaTag('og:description', description, true);
      setMetaTag('twitter:description', description, true);
    }
    
    if (keywords) {
      setMetaTag('keywords', keywords);
    }
    
    if (image) {
      setMetaTag('og:image', image, true);
      setMetaTag('twitter:image', image, true);
    }
  }, [title, description, keywords, image]);
  
  return null;
};

export default SEO;