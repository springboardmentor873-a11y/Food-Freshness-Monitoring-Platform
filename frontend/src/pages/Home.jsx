import { useState } from "react";

import Navbar from "../components/layout/Navbar";
import Hero from "../components/common/Hero";
import UploadCard from "../components/upload/UploadCard";
import ResultCard from "../components/prediction/ResultCard";
import Footer from "../components/layout/Footer";

function Home() {
  const [prediction, setPrediction] = useState(null);
  const [uploadedImage, setUploadedImage] = useState(null);

  return (
    <>
      <Navbar />

      <Hero />

      <UploadCard
        setPrediction={setPrediction}
        setUploadedImage={setUploadedImage}
      />

      {prediction && (
        <ResultCard
          prediction={prediction}
          uploadedImage={uploadedImage}
          onReset={() => {
            setPrediction(null);
            setUploadedImage(null);
          }}
        />
      )}

      <Footer />
    </>
  );
}

export default Home;