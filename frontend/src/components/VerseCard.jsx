import { forwardRef } from "react";
import { useLanguage } from "../context/LanguageContext.jsx";

const VerseCard = forwardRef(function VerseCard({ card, layout = "classic" }, ref) {
  const { t } = useLanguage();
  if (!card) return null;

  // Classic Layout Render
  if (layout === "classic") {
    return (
      <div className="card-wrapper">
        <article className="verse-card layout-classic" ref={ref} style={{
          backgroundImage: card.image?.url ? `linear-gradient(180deg, rgba(20, 14, 10, 0.45) 0%, rgba(15, 10, 8, 0.72) 50%, rgba(20, 14, 10, 0.85) 100%), url("${card.image.url}")` : undefined
        }}>
          <div className="card-quote-mark">“</div>
          <div className="card-content-area">
            <blockquote className="card-verse-text">{card.text}</blockquote>
            <div className="card-reference-area">
              <div className="card-reference-pill">
                <span>{card.reference}</span>
              </div>
            </div>
          </div>
          <div className="card-watermark">
            <span>{t.meta.watermark}</span>
          </div>
        </article>
        {renderCredit(card, t)}
      </div>
    );
  }

  // Minimal (Polaroid/Magazine) Layout Render
  if (layout === "minimal") {
    return (
      <div className="card-wrapper">
        <article className="verse-card layout-minimal" ref={ref}>
          <div className="minimal-image" style={{
            backgroundImage: card.image?.url ? `url("${card.image.url}")` : undefined
          }}></div>
          <div className="minimal-content">
            <blockquote className="minimal-text">"{card.text}"</blockquote>
            <div className="minimal-reference">— {card.reference}</div>
            <div className="minimal-watermark">{t.meta.watermark}</div>
          </div>
        </article>
        {renderCredit(card, t)}
      </div>
    );
  }

  // Elegant (Cinematic Frame) Layout Render
  if (layout === "elegant") {
    return (
      <div className="card-wrapper">
        <article className="verse-card layout-elegant" ref={ref} style={{
          backgroundImage: card.image?.url ? `linear-gradient(to bottom, rgba(10, 5, 2, 0.1) 0%, rgba(10, 5, 2, 0.95) 85%), url("${card.image.url}")` : undefined
        }}>
          <div className="elegant-frame">
            <div className="elegant-content">
              <blockquote className="elegant-text">{card.text}</blockquote>
              <div className="elegant-reference">{card.reference}</div>
            </div>
            <div className="elegant-watermark">{t.meta.watermark}</div>
          </div>
        </article>
        {renderCredit(card, t)}
      </div>
    );
  }

  return null;
});

function renderCredit(card, t) {
  if (!card.image) return null;
  return (
    <p className="image-credit">
      {t.meta.photoBy}{" "}
      <a href={card.image.authorUrl} target="_blank" rel="noreferrer">
        {card.image.author}
      </a>{" "}
      {t.meta.via}{" "}
      <a href={card.image.pageUrl} target="_blank" rel="noreferrer">
        {card.image.provider}
      </a>
    </p>
  );
}

export default VerseCard;
