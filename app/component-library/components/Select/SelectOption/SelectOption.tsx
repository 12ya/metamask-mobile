/* eslint-disable react/prop-types */

// Third party dependencies.
import React from 'react';

// External dependencies.
import { useStyles } from '../../../hooks';
import SelectItem from '../Select/SelectItem/SelectItem';
import SelectValue from '../SelectValue/SelectValue';

// Internal dependencies.
import styleSheet from './SelectOption.styles';
import { SelectOptionProps } from './SelectOption.types';

const SelectOption: React.FC<SelectOptionProps> = ({
  style,
  children,
  isSelected,
  isDisabled,
  gap = 12,
  verticalAlignment,
  ...props
}) => {
  const { styles } = useStyles(styleSheet, {
    style,
  });

  return (
    <SelectItem
      style={styles.base}
      gap={gap}
      verticalAlignment={verticalAlignment}
      isSelected={isSelected}
      isDisabled={isDisabled}
    >
      <SelectValue {...props} />
    </SelectItem>
  );
};

export default SelectOption;
