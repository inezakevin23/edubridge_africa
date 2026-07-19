import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { fetchHomeStats } from "../../services/homeService";

export default function Stats() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    let mounted = true;
    fetchHomeStats()
      .then((resp) => {
        if (!mounted) return;
        const list = Array.isArray(resp) ? resp : resp?.data || [];
        setItems(list);
      })
      .catch(() => {
        if (mounted) setItems([]);
      });
    return () => (mounted = false);
  }, []);

  return (
    <section className="py-12">
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3">
        {items.map((item, index) => (
          <motion.div
            key={index}
            whileHover={{ scale: 1.05 }}
            className="text-center border-r last:border-r-0 border-[#25334D] py-5"
          >
            <h2 className="text-5xl font-bold">{item.number}</h2>

            <p className="text-gray-500 mt-2">{item.label}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
