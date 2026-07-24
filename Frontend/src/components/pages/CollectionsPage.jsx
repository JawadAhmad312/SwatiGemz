import { useEffect, useState } from "react";
import axios from "axios";
import CollectionGrid from "../Collection/CollectionGrid";

const CollectionsPage = () => {

  const [collections, setCollections] = useState([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCollections();
  }, []);

  const fetchCollections = async () => {

    try {

      const res = await axios.get(
        "http://localhost:8080/api/gem-collections"
      );

      setCollections(res.data.collections);

    } catch (err) {

      console.log(err);

    } finally {

      setLoading(false);

    }
  };

  if (loading) {
    return (
      <div className="py-32 text-center">
        Loading...
      </div>
    );
  }

  return (
    <section
      className="
        min-h-screen
        py-12
        px-4
      "
    >

      <div className="max-w-7xl mx-auto">

        {/* HEADING */}

        <div className="text-center mb-20">

          <h1
            className="
            text-2xl
              md:text-5xl
              font-bold
              tracking-tight
            "
          >
            Gemstones Collections
          </h1>

          <p
            className="
              mt-5
              text-gray-900
dark:text-white
              md:text-gray-600
              max-w-2xl
              mx-auto
              leading-8
              text-[18px]
            "
          >
            Explore our premium gemstone
            collections crafted with luxury,
            authenticity, and timeless beauty.
          </p>

        </div>

        {/* GRID */}

        <CollectionGrid
          collections={collections}
        />

      </div>

    </section>
  );
};

export default CollectionsPage;