import React, { FC, FormEvent } from 'react';
import FilterInput from './FilterInput';
import { RangeSlider } from 'reactrangeslider';

export interface FilterSliderCardProps {
  className?: string;
  values: { start: string; end: string };
  minVal: number;
  maxVal: number;
  unit: string;
  handleChange: (event: FormEvent<Element>) => void;
}

const FilterSliderCard: FC<FilterSliderCardProps> = ({
  className = '',
  values,
  minVal,
  maxVal,
  unit,
  handleChange,
}) => {
  return (
    <div
      className={`filter-slider-card ${className}`}
      style={{
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <RangeSlider
        step={5}
        value={values}
        min={minVal}
        max={maxVal}
        onChange={handleChange}
        // wrapperStyle={styles.slider}
        // trackStyle={styles.trackStyle}
        // highlightedTrackStyle={styles.highlightedTrackStyle}
        // handleStyle={styles.handleStyle}
        // hoveredHandleStyle={styles.hoveredHandleStyle}
        // focusedHandleStyle={styles.focusedHandleStyle}
        // activeHandleStyle={styles.activeHandleStyle}
      />
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}
      >
        <FilterInput
          value={values.start}
          append={unit}
          handleChange={handleChange}
          name="priceMin"
        />
        to
        <FilterInput
          value={values.end}
          append={unit}
          handleChange={handleChange}
          name="priceMax"
        />
      </div>
    </div>
  );
};

export default FilterSliderCard;
