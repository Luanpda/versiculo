import { forwardRef } from "react";

const VerseCard = forwardRef(function VerseCard({ card }, ref) {
  if (!card) return null;

  const backgroundImage = card.image?.url
    ? `linear-gradient(180deg, rgba(20, 14, 10, 0.55) 0%, rgba(15, 10, 8, 0.72) 50%, rgba(20, 14, 10, 0.85) 100%), url("${card.image.url}")`
    : undefined;

  return (
    <div className="card-wrapper">
      <article className="verse-card" ref={ref} style={{ backgroundImage }}>
        <div className="card-ornament-top">
          <span className="card-tag">{card.categoryTitle || "✨ PALAVRA DO DIA"}</span>
        </div>

        <div className="card-quote-mark">“</div>
        <blockquote className="card-verse-text">{card.text}</blockquote>
        
        <div className="card-reference-pill">
          <span>{card.reference}</span>
        </div>

        <div className="card-watermark">
          <span>✨ Palavra do Dia</span>
        </div>
      </article>

      {card.image && (
        <p className="image-credit">
          Foto por{" "}
          <a href={card.image.authorUrl} target="_blank" rel="noreferrer">
            {card.image.author}
          </a>{" "}
          via{" "}
          <a href={card.image.pageUrl} target="_blank" rel="noreferrer">
            {card.image.provider}
          </a>
        </p>
      )}
    </div>
  );
});

export default VerseCard;
