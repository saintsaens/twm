import Navigation from './Navigation';
import Title from "./Title";

function Header() {
    return (
        <header role="banner" className="fr-header">
            <div className="fr-header__body">
                <div className="fr-container">
                    <div className="fr-header__body-row">
                        <Title />
                        <div className="fr-header__tools">
                            <Navigation />
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}

export default Header;
