import Banner from "../../../components/display/Banner";
import Footer from "../../../components/display/Footer";
import ProductsSlide from "../../../components/display/ProductsSlide";
import ScrollButton from "../../../components/features/ScrollButton";
import Header from "../../../components/Header/Header";
import HeaderTop from "../../../components/Header/HeaderTop";
import CardList from "../../../components/Products/CardList";
import LayoutModeBackground from "../layout/LayoutModeBackground";

const Home = () => {
  return (
    <div className="w-full">
      <HeaderTop />
      <Header /> <Banner />
      <LayoutModeBackground>
        <ProductsSlide />
        <CardList />
        <ScrollButton />
      </LayoutModeBackground>
      <Footer />
    </div>
  );
};

export default Home;
