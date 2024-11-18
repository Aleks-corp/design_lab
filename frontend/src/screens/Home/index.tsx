import Hero from "./Hero/index";
import Selection from "./Selection/index";
import Popular from "./Popular/index";
import HotBid from "../../components/HotBid/index";
import Collections from "./Collections/index";
import Discover from "./Discover/index";
import Description from "./Description/index";

const Home = () => {
  return (
    <>
      <Hero />
      <Selection />
      <Popular />
      <HotBid classSection="section" />
      <Collections />
      <Discover />
      <Description />
    </>
  );
};

export default Home;
