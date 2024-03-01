import React, { PureComponent } from 'react';
import { Platform, TouchableOpacity, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import ElevatedView from 'react-native-elevated-view';
import TabCountIcon from '../Tabs/TabCountIcon';
import Icon from 'react-native-vector-icons/FontAwesome';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import FeatherIcons from 'react-native-vector-icons/Feather';
import { MetaMetricsEvents } from '../../../core/Analytics';

import Device from '../../../util/device';
import { ThemeContext, mockTheme } from '../../../util/theme';
import generateTestId from '../../../../wdio/utils/generateTestId';
import {
  HOME_BUTTON,
  TABS_BUTTON,
  FORWARD_BUTTON,
  BACK_BUTTON,
  OPTIONS_BUTTON,
  SEARCH_BUTTON,
} from '../../../../wdio/screen-objects/testIDs/BrowserScreen/BrowserScreen.testIds';
import { withMetricsAwareness } from '../../../components/hooks/useMetrics';

// NOTE: not needed anymore. The use of BottomTabBar already accomodates the home indicator height
// TODO: test on an android device
// const HOME_INDICATOR_HEIGHT = 0;
// const defaultBottomBarPadding = 0;

const createStyles = (colors) =>
  StyleSheet.create({
    bottomBar: {
      backgroundColor: colors.background.default,
      flexDirection: 'row',
      flex: 0,
      borderTopWidth: Device.isAndroid() ? 0 : StyleSheet.hairlineWidth,
      borderColor: colors.border.muted,
      justifyContent: 'space-between',
    },
    iconButton: {
      height: 24,
      width: 24,
      justifyContent: 'space-around',
      alignItems: 'center',
      textAlign: 'center',
      flex: 1,
      paddingTop: 30,
      paddingBottom: 30,
    },
    tabIcon: {
      marginTop: 0,
      width: 24,
      height: 24,
    },
    disabledIcon: {
      color: colors.icon.muted,
    },
    icon: {
      width: 24,
      height: 24,
      color: colors.icon.default,
      textAlign: 'center',
    },
  });

/**
 * Browser bottom bar that contains icons for navigation
 * tab management, url change and other options
 */
class BrowserBottomBar extends PureComponent {
  static propTypes = {
    /**
     * Boolean that determines if you can navigate back
     */
    canGoBack: PropTypes.bool,
    /**
     * Boolean that determines if you can navigate forward
     */
    canGoForward: PropTypes.bool,
    /**
     * Function that allows you to navigate back
     */
    goBack: PropTypes.func,
    /**
     * Function that allows you to navigate forward
     */
    goForward: PropTypes.func,
    /**
     * Function that triggers the tabs view
     */
    showTabs: PropTypes.func,
    /**
     * Function that triggers the change url modal view
     */
    showUrlModal: PropTypes.func,
    /**
     * Function that redirects to the home screen
     */
    goHome: PropTypes.func,
    /**
     * Function that toggles the options menu
     */
    toggleOptions: PropTypes.func,
    /**
     * Metrics injected by withMetricsAwareness HOC
     */
    metrics: PropTypes.object,
  };

  trackSearchEvent = () => {
    this.props.metrics.trackEvent(MetaMetricsEvents.BROWSER_SEARCH_USED, {
      option_chosen: 'Browser Bottom Bar Menu',
      number_of_tabs: undefined,
    });
  };

  trackNavigationEvent = (navigationOption) => {
    this.props.metrics.trackEvent(MetaMetricsEvents.BROWSER_NAVIGATION, {
      option_chosen: navigationOption,
      os: Platform.OS,
    });
  };

  render() {
    const {
      canGoBack,
      goBack,
      canGoForward,
      goForward,
      showTabs,
      goHome,
      showUrlModal,
      toggleOptions,
    } = this.props;
    const colors = this.context.colors || mockTheme.colors;
    const styles = createStyles(colors);

    const onSearchPress = () => {
      showUrlModal();
      this.trackSearchEvent();
    };

    const onBackPress = () => {
      goBack();
      this.trackNavigationEvent('Go Back');
    };

    const onForwardPress = () => {
      goForward();
      this.trackNavigationEvent('Go Forward');
    };

    const onHomePress = () => {
      goHome();
      this.trackNavigationEvent('Go Home');
    };

    return (
      <ElevatedView elevation={11} style={styles.bottomBar}>
        <TouchableOpacity
          onPress={onBackPress}
          style={styles.iconButton}
          {...generateTestId(Platform, BACK_BUTTON)}
          disabled={!canGoBack}
        >
          <Icon
            name="angle-left"
            size={24}
            style={[styles.icon, !canGoBack ? styles.disabledIcon : {}]}
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={onForwardPress}
          style={styles.iconButton}
          {...generateTestId(Platform, FORWARD_BUTTON)}
          disabled={!canGoForward}
        >
          <Icon
            name="angle-right"
            size={24}
            style={[styles.icon, !canGoForward ? styles.disabledIcon : {}]}
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={onSearchPress}
          style={styles.iconButton}
          {...generateTestId(Platform, SEARCH_BUTTON)}
        >
          <FeatherIcons name="search" size={24} style={styles.icon} />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={showTabs}
          style={styles.iconButton}
          {...generateTestId(Platform, TABS_BUTTON)}
        >
          <TabCountIcon style={styles.tabIcon} />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={onHomePress}
          style={styles.iconButton}
          {...generateTestId(Platform, HOME_BUTTON)}
        >
          <SimpleLineIcons name="home" size={22} style={styles.icon} />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={toggleOptions}
          style={styles.iconButton}
          {...generateTestId(Platform, OPTIONS_BUTTON)}
        >
          <MaterialIcon name="more-horiz" size={22} style={styles.icon} />
        </TouchableOpacity>
      </ElevatedView>
    );
  }
}

BrowserBottomBar.contextType = ThemeContext;
export default withMetricsAwareness(BrowserBottomBar);
