import { forwardRef } from "react";
import { useLanguage } from "../context/LanguageContext.jsx";

const VerseCard = forwardRef(function VerseCard({ card }, ref) {
  const { t } = useLanguage();
  if (!card) return null;

  const backgroundImage = card.image?.url
    ? `linear-gradient(180deg, rgba(20, 14, 10, 0.55) 0%, rgba(15, 10, 8, 0.72) 50%, rgba(20, 14, 10, 0.85) 100%), url("${card.image.url}")`
    : undefined;

  return (
    <div className="card-wrapper">
      <article className="verse-card" ref={ref} style={{ backgroundImage }}>
        <div className="card-ornament-top">
          <span className="card-tag">{card.categoryTitle || t.meta.watermark}</span>
        </div>

        <div className="card-quote-mark">“</div>
        <blockquote className="card-verse-text">{card.text}</blockquote>
        
        <div className="card-reference-pill">
          <span>{card.reference}</span>
        </div>

        <div className="card-watermark">
          <span>{t.meta.watermark}</span>
        </div>
      </article>

      {card.image && (
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
      )}
    </div>
  );
});

export default VerseCard;
