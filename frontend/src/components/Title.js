import { Link } from "react-router-dom";

function Title() {
  return (
    <Link class="fr-header__brand fr-enlarge-link" to="/">
      <div class="fr-header__brand-top">
        <div class="fr-header__logo">
          <img src="/logo.png" height="100" alt="Logo" />
        </div>
        <div class="fr-header__navbar">
          <button data-fr-opened="false" aria-controls="modal-2579" id="button-2580" title="Menu" class="fr-btn--menu fr-btn">Menu</button>
        </div>
      </div>
      <div class="fr-header__service">
        <p class="fr-header__service-title">
          The Witcher Marketplace
        </p>
        <p class="fr-header__service-tagline">Where you can steel swords.</p>
      </div>
    </Link>
  );
}

export default Title;
