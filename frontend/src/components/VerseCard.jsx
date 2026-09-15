import { forwardRef } from "react";
import { useLanguage } from "../context/LanguageContext.jsx";

const VerseCard = forwardRef(function VerseCard({ card, variation = 1 }, ref) {
  const { t } = useLanguage();
  if (!card) return null;

  // Gradientes variam de acordo com a variação, mas sempre escuros o suficiente para garantir contraste
  let gradient = "linear-gradient(180deg, rgba(20, 14, 10, 0.45) 0%, rgba(15, 10, 8, 0.72) 50%, rgba(20, 14, 10, 0.85) 100%)";
  
  if (variation % 3 === 0) {
    gradient = "linear-gradient(135deg, rgba(30, 20, 15, 0.7) 0%, rgba(10, 8, 5, 0.9) 100%)";
  } else if (variation % 2 === 0) {
    gradient = "radial-gradient(circle at center, rgba(30, 20, 15, 0.5) 0%, rgba(10, 5, 2, 0.9) 100%)";
  }

  const backgroundImage = card.image?.url
    ? `${gradient}, url("${card.image.url}")`
    : undefined;

  return (
    <div className="card-wrapper">
      <article className={`verse-card var-${variation}`} ref={ref} style={{ backgroundImage }}>
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
