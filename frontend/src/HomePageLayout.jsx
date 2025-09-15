import { Outlet } from 'react-router-dom';
import TopBar from './TopBar';
import HeaderNav from './HeaderNav';
import Footer from './Footer';
import BackToTop from './BackToTop';

function HomePageLayout() {

    return (
        <>
            <TopBar />
            <HeaderNav/>
            <main style={{ padding: '1rem' }}>
                <Outlet />
            </main>
            <Footer />
            <BackToTop />
        </>
    );
};

export default HomePageLayout;
