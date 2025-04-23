import React from "react";

function ShareButton({ product }) {
  const shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
    product.url
  )}`;

  return (
    <a href={shareUrl} target="_blank" rel="noopener noreferrer">
      <button className="share-button">Share on Facebook</button>
    </a>
  );
}

export default ShareButton;
