// Third party dependencies.
import { ViewProps } from 'react-native';

/**
 * BaseSelectableMenu component props.
 */
export interface BaseSelectableMenuProps extends ViewProps {
  /**
   * Optional enum to replace the Header.
   */
  headerEl?: React.ReactNode;
  /**
   * Optional enum to replace the content section between the Header and Footer.
   */
  children?: React.ReactNode;
  /**
   * Optional enum to replace the Footer.
   */
  footerEl?: React.ReactNode;
}

/**
 * Style sheet BaseSelectableMenu parameters.
 */
export type BaseSelectableMenuStyleSheetVars = Pick<
  BaseSelectableMenuProps,
  'style'
>;
