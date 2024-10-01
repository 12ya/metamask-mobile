import React, { useCallback, useEffect, useRef, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, {
  cancelAnimation,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated';
import Device from '@util/device';
import BaseTitle from '@components/Base/Title';
import FoxComponent from '@components/UI/Fox';
import backgroundShapes from './backgroundShapes';
import { useTheme } from '@util/theme';
import { Colors } from '@util/theme/models';

// TODO: Convert into typescript and correctly type
// TODO: Replace "any" with type
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const Title = BaseTitle as any;
// TODO: Replace "any" with type
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const Fox = FoxComponent as any;

const ANIM_MULTIPLIER = 0.67;
const START_DURATION = 1000 * ANIM_MULTIPLIER;
const FINISH_DURATION = 500 * ANIM_MULTIPLIER;
const DELAY = 1000 * ANIM_MULTIPLIER;

const IS_NARROW = Device.getDeviceWidth() <= 320;
const STAGE_SIZE = IS_NARROW ? 240 : 260;
const FINALIZING_PERCENTAGE = 80;

const createStyles = (
  colors: Colors,
  options?: {
    asScreen: boolean;
  },
) =>
  StyleSheet.create({
    screen: {
      flex: options?.asScreen ? 1 : undefined,
      justifyContent: 'center',
      alignItems: 'center',
    },
    content: {
      width: '100%',
      paddingHorizontal: 60,
      marginVertical: 60,
    },
    progressWrapper: {
      backgroundColor: colors.primary.muted,
      height: 3,
      borderRadius: 3,
      marginVertical: 15,
    },
    progressBar: {
      backgroundColor: colors.primary.default,
      height: 3,
      width: 3,
      borderRadius: 3,
      flex: 1,
    },
    foxContainer: {
      width: STAGE_SIZE,
      height: STAGE_SIZE,
      alignSelf: 'center',
    },
  });

const customStyle = (colors: Colors) => `
	body {
		background-color: ${colors.background.default};
	}
	#head {
		height: 35%;
		top: 50%;
		transform: translateY(-50%);
	}
	#bgShapes {
		position: absolute;
		left: 50%;
		top: 50%;
		width: 70%;
		height: 70%;
		transform: translateX(-50%) translateY(-50%) rotate(0deg);
		animation: rotate 50s linear infinite;
	}

	@keyframes rotate {
		to {
			transform: translateX(-50%) translateY(-50%) rotate(360deg);
		}
	}
`;

interface Props {
  title: string;
  finish: boolean;
  // TODO: Replace "any" with type
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onAnimationEnd?: () => any;
  asScreen?: boolean;
}

function LoadingAnimation({
  title,
  finish,
  onAnimationEnd,
  asScreen = true,
}: Props): React.ReactElement<Props> {
  const { colors } = useTheme();
  const styles = createStyles(colors, { asScreen });
  const [hasStartedFinishing, setHasStartedFinishing] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);

  /* References */
  const foxRef = useRef();
  const progressWidth = useSharedValue(0);

  const startAnimation = useCallback(() => {
    setHasStarted(true);
    progressWidth.value = withDelay(
      DELAY,
      withTiming(FINALIZING_PERCENTAGE, {
        duration: START_DURATION,
      }),
    );
  }, [progressWidth]);

  const endAnimation = useCallback(() => {
    setHasStartedFinishing(true);
    cancelAnimation(progressWidth);
    progressWidth.value = withTiming(
      100,
      {
        duration: FINISH_DURATION,
      },
      () => {
        if (onAnimationEnd) {
          runOnJS(onAnimationEnd)();
        }
      },
    );
  }, [onAnimationEnd, progressWidth]);

  const progressStyle = useAnimatedStyle(
    () => ({
      width: `${progressWidth.value}%`,
    }),
    [progressWidth],
  );

  /* Effects */

  /* Effect to finish animation once sequence is completed */
  useEffect(() => {
    if (finish && !hasStartedFinishing) {
      endAnimation();
    }
  }, [endAnimation, finish, hasStartedFinishing]);

  if (!hasStarted) {
    startAnimation();
  }

  return (
    <View style={styles.screen}>
      <View style={styles.content}>
        <Title centered>{title}</Title>

        <View style={styles.progressWrapper}>
          <Animated.View style={[styles.progressBar, progressStyle]} />
        </View>
        <View style={styles.foxContainer} pointerEvents="none">
          <Fox
            ref={foxRef}
            customContent={backgroundShapes}
            customStyle={customStyle(colors)}
          />
        </View>
      </View>
    </View>
  );
}

export default LoadingAnimation;
