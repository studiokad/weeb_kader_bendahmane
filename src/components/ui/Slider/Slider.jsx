import { useCallback, useEffect, useRef, useState } from "react";
import styles from "./Slider.module.css";

/**
 * Carrousel horizontal accessible, sans dependance externe.
 *
 * Navigation possible aux fleches, aux points, au clavier (fleches gauche/droite)
 * et au glisser tactile. La lecture automatique se met en pause au survol, au
 * focus clavier et quand l'onglet passe en arriere-plan, pour ne pas faire
 * defiler une diapositive que personne ne regarde.
 *
 * @param {Array} slides            - Elements a afficher, un par diapositive.
 * @param {Function} renderSlide    - (item, index) => noeud React.
 * @param {number} [autoPlayMs=0]   - Delai de defilement auto ; 0 desactive.
 * @param {string} label            - Nom accessible du carrousel.
 */
function Slider({ slides, renderSlide, autoPlayMs = 0, label }) {
  const [index, setIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartX = useRef(null);

  const count = slides.length;

  const goTo = useCallback(
    (next) => {
      // Modulo positif : la navigation boucle dans les deux sens.
      setIndex(((next % count) + count) % count);
    },
    [count],
  );

  const goNext = useCallback(() => goTo(index + 1), [goTo, index]);
  const goPrev = useCallback(() => goTo(index - 1), [goTo, index]);

  // Defilement automatique. Le timer est recree a chaque changement d'index,
  // ce qui redonne un cycle complet apres une navigation manuelle.
  useEffect(() => {
    if (!autoPlayMs || isPaused || count <= 1) return undefined;

    const timer = window.setTimeout(goNext, autoPlayMs);
    return () => window.clearTimeout(timer);
  }, [autoPlayMs, isPaused, count, index, goNext]);

  // Onglet en arriere-plan : on suspend, sinon le carrousel avance dans le vide.
  useEffect(() => {
    const onVisibilityChange = () => setIsPaused(document.hidden);

    document.addEventListener("visibilitychange", onVisibilityChange);
    return () =>
      document.removeEventListener("visibilitychange", onVisibilityChange);
  }, []);

  const onKeyDown = (event) => {
    if (event.key === "ArrowRight") {
      event.preventDefault();
      goNext();
    }
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      goPrev();
    }
  };

  const onTouchStart = (event) => {
    touchStartX.current = event.touches[0].clientX;
  };

  const onTouchEnd = (event) => {
    if (touchStartX.current === null) return;

    const delta = event.changedTouches[0].clientX - touchStartX.current;
    const SWIPE_THRESHOLD_PX = 50; // en deca, c'est un appui, pas un glisse.

    if (Math.abs(delta) > SWIPE_THRESHOLD_PX) {
      if (delta < 0) goNext();
      else goPrev();
    }

    touchStartX.current = null;
  };

  return (
    <div
      className={styles.slider}
      role="group"
      aria-roledescription="carrousel"
      aria-label={label}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocus={() => setIsPaused(true)}
      onBlur={() => setIsPaused(false)}
      onKeyDown={onKeyDown}
    >
      <div
        className={styles.viewport}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        <div
          className={styles.track}
          style={{ transform: `translateX(-${index * 100}%)` }}
        >
          {slides.map((slide, slideIndex) => (
            <div
              className={styles.slide}
              key={slide.id ?? slideIndex}
              role="group"
              aria-roledescription="diapositive"
              aria-label={`${slideIndex + 1} sur ${count}`}
              aria-hidden={slideIndex !== index}
              // inert retire la diapositive masquee de l'ordre de tabulation.
              inert={slideIndex !== index ? "" : undefined}
            >
              {renderSlide(slide, slideIndex)}
            </div>
          ))}
        </div>
      </div>

      <div className={styles.controls}>
        <button
          type="button"
          className={styles.arrow}
          onClick={goPrev}
          aria-label="Diapositive précédente"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
            <path
              d="M15 6l-6 6 6 6"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        <div className={styles.dots}>
          {slides.map((slide, dotIndex) => (
            <button
              type="button"
              key={slide.id ?? dotIndex}
              className={styles.dotHit}
              onClick={() => goTo(dotIndex)}
              aria-label={`Aller à la diapositive ${dotIndex + 1}`}
              aria-current={dotIndex === index}
            >
              <span
                className={[
                  styles.dot,
                  dotIndex === index ? styles.dotActive : "",
                ]
                  .filter(Boolean)
                  .join(" ")}
              />
            </button>
          ))}
        </div>

        <button
          type="button"
          className={styles.arrow}
          onClick={goNext}
          aria-label="Diapositive suivante"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
            <path
              d="M9 6l6 6-6 6"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}

export default Slider;
