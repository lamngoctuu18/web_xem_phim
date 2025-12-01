import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getCategories, getCountries, getYears } from '../services/api';
import type { FilterItem, YearItem } from '../types/movie';
import { FiFilm, FiGlobe, FiCalendar } from 'react-icons/fi';

interface FilterGroupProps {
  title: string;
  items: Array<{ label: string; to: string }>;
  icon: React.ReactNode;
}

const FilterGroup = ({ title, items, icon }: FilterGroupProps) => {
  if (!items.length) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      className="bg-gradient-to-br from-dark-lighter to-dark-light rounded-2xl p-6 md:p-8 shadow-xl border border-white/5 hover:border-primary/30 transition-all duration-300"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-gradient-to-br from-primary to-red-500 rounded-xl shadow-lg">
          {icon}
        </div>
        <h2 className="text-2xl font-bold text-white">{title}</h2>
      </div>
      <div className="flex flex-wrap gap-3">
        {items.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            className="group relative bg-dark hover:bg-gradient-to-r hover:from-primary hover:to-red-500 text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 border border-white/10 hover:border-transparent hover:scale-105 hover:shadow-lg hover:shadow-primary/30"
          >
            <span className="relative z-10">{item.label}</span>
          </Link>
        ))}
      </div>
    </motion.div>
  );
};

const FilterSection = () => {
  const [categories, setCategories] = useState<FilterItem[]>([]);
  const [countries, setCountries] = useState<FilterItem[]>([]);
  const [years, setYears] = useState<YearItem[]>([]);

  useEffect(() => {
    let isMounted = true;

    const fetchFilters = async () => {
      try {
        const [categoryData, countryData, yearData] = await Promise.all([
          getCategories(),
          getCountries(),
          getYears(),
        ]);

        if (!isMounted) return;

        setCategories(categoryData);
        setCountries(countryData);
        setYears(yearData.slice().sort((a, b) => b.year - a.year));
      } catch (error) {
        console.error('Error fetching filter data:', error);
      }
    };

    fetchFilters();

    return () => {
      isMounted = false;
    };
  }, []);

  const categoryLinks = categories.slice(0, 18).map((item) => ({
    label: item.name,
    to: `/the-loai/${item.slug}`,
  }));

  const countryLinks = countries.slice(0, 18).map((item) => ({
    label: item.name,
    to: `/quoc-gia/${item.slug}`,
  }));

  const yearLinks = years.slice(0, 15).map((item) => ({
    label: `${item.year}`,
    to: `/nam-phat-hanh/${item.year}`,
  }));

  return (
    <section className="space-y-8">
      <FilterGroup 
        title="Khám phá theo thể loại" 
        items={categoryLinks} 
        icon={<FiFilm size={24} className="text-white" />}
      />
      <FilterGroup 
        title="Khám phá theo quốc gia" 
        items={countryLinks} 
        icon={<FiGlobe size={24} className="text-white" />}
      />
      <FilterGroup 
        title="Khám phá theo năm" 
        items={yearLinks} 
        icon={<FiCalendar size={24} className="text-white" />}
      />
    </section>
  );
};

export default FilterSection;
