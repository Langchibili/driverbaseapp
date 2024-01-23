import React, { useEffect } from 'react';

const GoogleAd = ({ adClient, adSlot }) => {
  useEffect(() => {
    (window.adsbygoogle = window.adsbygoogle || []).push({});
  }, []);

  return (
    <ins
      className="adsbygoogle"
      style={{ display: 'block' }}
      data-ad-client={adClient}
      data-ad-slot={adSlot}
      data-ad-format="auto"
    ></ins>
  );
};

export default GoogleAd;
