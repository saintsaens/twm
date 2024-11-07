import Navigation from './Navigation';
import Title from "./Title";

function Header() {
    return (
        <header role="banner" class="fr-header">
            <div class="fr-header__body">
                <div class="fr-container">
                    <div class="fr-header__body-row">
                        <Title />
                        <div class="fr-header__tools">
                            <Navigation />
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}

export default Header;
