import { forwardRef } from "react";
import { useLanguage } from "../context/LanguageContext.jsx";

const VerseCard = forwardRef(function VerseCard({ card, layout = "classic" }, ref) {
  const { t } = useLanguage();
  if (!card) return null;

  // Diferentes gradientes para os diferentes layouts para dar mais personalidade
  let gradient = "linear-gradient(180deg, rgba(20, 14, 10, 0.45) 0%, rgba(15, 10, 8, 0.65) 50%, rgba(20, 14, 10, 0.85) 100%)";
  if (layout === "minimal") {
    gradient = "linear-gradient(to right, rgba(15, 10, 8, 0.85) 0%, rgba(20, 14, 10, 0.4) 100%)";
  } else if (layout === "elegant") {
    gradient = "radial-gradient(circle at center, rgba(30, 20, 15, 0.4) 0%, rgba(15, 10, 8, 0.85) 100%)";
  }

  const backgroundImage = card.image?.url
    ? `${gradient}, url("${card.image.url}")`
    : undefined;

  return (
    <div className="card-wrapper">
      <article className={`verse-card layout-${layout}`} ref={ref} style={{ backgroundImage }}>
        
        {layout === "classic" && <div className="card-quote-mark">“</div>}
        
        <div className="card-content-area">
          {layout === "elegant" && <div className="elegant-divider-top"></div>}
          <blockquote className="card-verse-text">{card.text}</blockquote>
          
          <div className="card-reference-area">
            {layout === "classic" && (
              <div className="card-reference-pill">
                <span>{card.reference}</span>
              </div>
            )}
            
            {layout !== "classic" && (
              <div className="card-reference-text">
                <span>{card.reference}</span>
              </div>
            )}
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
