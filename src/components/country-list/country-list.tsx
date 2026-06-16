import { useMemo, memo, useRef, useState, useEffect } from 'react';
import { List, type RowComponentProps } from 'react-window';
import type { Country } from '../../types';
import { CountryCard } from '../country-card/country-card';
import { getPopulationForYear, createYearDataMap } from '../../utils/data-transformers';

import styles from './country-list.module.css';

type CountryListProps = {
  countries: Country[];
  searchQuery: string;
  selectedColumns: string[];
  selectedRegion: string;
  selectedYear: number;
  sortField: 'name' | 'population';
  sortOrder: 'asc' | 'desc';
  onYearChange: (year: number) => void;
};

type RowData = {
  countries: Country[];
  selectedYear: number;
  selectedColumns: string[];
};

const Row = ({
  index,
  style,
  countries,
  selectedYear,
  selectedColumns,
}: RowComponentProps<RowData>) => {
  const country = countries[index];
  if (!country) {
    return null;
  }

  return (
    <div style={style}>
      <CountryCard
        country={country}
        selectedYear={selectedYear}
        selectedColumns={selectedColumns}
      />
    </div>
  );
};

const ITEM_HEIGHT = 280;

export const CountryList = memo(
  ({
    countries = [],
    searchQuery,
    selectedColumns,
    selectedRegion,
    selectedYear,
    sortField,
    sortOrder,
  }: CountryListProps) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [containerWidth, setContainerWidth] = useState(0);
    const [containerHeight, setContainerHeight] = useState(0);

    useEffect(() => {
      if (containerRef.current) {
        const observer = new ResizeObserver(([entry]) => {
          if (entry) {
            setContainerWidth(entry.contentRect.width);
            setContainerHeight(entry.contentRect.height);
          }
        });

        observer.observe(containerRef.current);
        return () => observer.disconnect();
      }
    }, []);

    const filteredCountries = useMemo(() => {
      return countries
        .filter((c) => c && Array.isArray(c.data))
        .filter((c) => {
          const matchesSearch = c.id?.toLowerCase().includes(searchQuery.toLowerCase());
          const matchesRegion =
            !selectedRegion || c.data.some((d) => d && d.region === selectedRegion);
          return matchesSearch && matchesRegion;
        })
        .sort((a, b) => {
          if (sortField === 'name') {
            return sortOrder === 'asc' ? a.id.localeCompare(b.id) : b.id.localeCompare(a.id);
          }
          const popA = getPopulationForYear(createYearDataMap(a.data), selectedYear) || 0;
          const popB = getPopulationForYear(createYearDataMap(b.data), selectedYear) || 0;
          return sortOrder === 'asc' ? popA - popB : popB - popA;
        });
    }, [countries, searchQuery, selectedRegion, sortField, sortOrder, selectedYear]);

    const rowProps = useMemo<RowData>(
      () => ({ countries: filteredCountries, selectedYear, selectedColumns }),
      [filteredCountries, selectedYear, selectedColumns]
    );

    if (filteredCountries.length === 0) {
      return <div className={styles.noResults}>No countries match your search.</div>;
    }

    return (
      <div ref={containerRef} style={{ height: '80vh', width: '100%' }}>
        {containerWidth > 0 && containerHeight > 0 && (
          <List
            rowComponent={Row}
            rowCount={filteredCountries.length}
            rowHeight={ITEM_HEIGHT}
            rowProps={rowProps}
          />
        )}
      </div>
    );
  }
);

CountryList.displayName = 'CountryList';
