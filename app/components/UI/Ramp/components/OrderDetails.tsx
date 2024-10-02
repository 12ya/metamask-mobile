import React, { useCallback } from 'react';
import {
  Image,
  Linking,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSelector } from 'react-redux';
import { Order, OrderStatusEnum } from '@consensys/on-ramp-sdk';
import { OrderOrderTypeEnum } from '@consensys/on-ramp-sdk/dist/API';
import Feather from 'react-native-vector-icons/Feather';
import Box from './Box';
import Text from '@components/Base/Text';
import BaseListItem from '@components/Base/ListItem';
import { toDateFormat } from '@util/date';
import { useTheme } from '@util/theme';
import { strings } from '@locales/i18n';
import {
  renderFiat,
  renderFromTokenMinimalUnit,
  toTokenMinimalUnit,
} from '@util/number';
import { FiatOrder, getProviderName } from '@reducers/fiatOrders';
import useBlockExplorer from '@components/UI/Swaps/utils/useBlockExplorer';
import Spinner from '@components/UI/AnimatedSpinner';
import useAnalytics from '@components/UI/Ramp/hooks/useAnalytics';
import { PROVIDER_LINKS } from '@components/UI/Ramp/types';
import Account from './Account';
import { FIAT_ORDER_STATES } from '@constants/on-ramp';
import { getOrderAmount } from '@components/UI/Ramp/utils';
import {
  selectNetworkConfigurations,
  selectProviderConfig,
} from '@selectors/networkController';

/* eslint-disable-next-line import/no-commonjs, @typescript-eslint/no-var-requires, @typescript-eslint/no-require-imports */
const failedIcon = require('./images/TransactionIcon_Failed.png');

// TODO: Convert into typescript and correctly type optionals
// TODO: Replace "any" with type
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const ListItem = BaseListItem as any;

// TODO: Replace "any" with type
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const createStyles = (colors: any) =>
  StyleSheet.create({
    stage: {
      alignItems: 'center',
    },
    seperationBottom: {
      paddingVertical: 4,
      paddingBottom: 18,
    },
    transactionIdFlex: {
      flex: 1,
    },
    line: {
      backgroundColor: colors.border.muted,
      height: 1,
      marginVertical: 12,
    },
    tokenAmount: {
      fontSize: 24,
    },
    flexZero: {
      flex: 0,
    },
    row: {
      marginVertical: 4,
    },
    group: {
      marginVertical: 8,
    },
  });

interface PropsStage {
  order: FiatOrder;
  isTransacted: boolean;
}

const Row: React.FC = (props) => {
  const { colors } = useTheme();
  const styles = createStyles(colors);
  return <View style={styles.row} {...props} />;
};
const Group: React.FC = (props) => {
  const { colors } = useTheme();
  const styles = createStyles(colors);
  return <View style={styles.group} {...props} />;
};

const Stage: React.FC<PropsStage> = ({ order, isTransacted }: PropsStage) => {
  const { colors } = useTheme();
  const styles = createStyles(colors);
  const orderData = order.data as Order;

  switch (order.state) {
    case FIAT_ORDER_STATES.COMPLETED: {
      return (
        <View style={styles.stage}>
          <Feather
            name="check-circle"
            size={32}
            color={colors.success.default}
          />
          <Group>
            <Text bold big primary centered>
              {strings('fiat_on_ramp_aggregator.order_details.successful')}
            </Text>
            {orderData.statusDescription ? (
              <Text small centered grey>
                {orderData.statusDescription}
              </Text>
            ) : null}
          </Group>
        </View>
      );
    }
    case FIAT_ORDER_STATES.CANCELLED:
    case FIAT_ORDER_STATES.FAILED: {
      return (
        <View style={styles.stage}>
          <Image source={failedIcon} />
          <Group>
            <Text bold big primary centered>
              {order.state === 'FAILED'
                ? strings('fiat_on_ramp_aggregator.order_details.failed')
                : strings('fiat_on_ramp_aggregator.order_details.cancelled')}
            </Text>
            {orderData.statusDescription ? (
              <Text small centered grey>
                {orderData.statusDescription}
              </Text>
            ) : null}
          </Group>
        </View>
      );
    }
    case FIAT_ORDER_STATES.CREATED:
      return (
        <View style={styles.stage}>
          <Spinner />
          <Group>
            <Text bold big primary centered>
              {strings(
                isTransacted
                  ? 'transaction.submitted'
                  : 'fiat_on_ramp_aggregator.order_details.pending',
              )}
            </Text>
            {isTransacted && Boolean(orderData.timeDescriptionPending) ? (
              <Text small centered grey>
                {orderData.timeDescriptionPending}
              </Text>
            ) : null}
            {!isTransacted && Boolean(orderData.statusDescription) ? (
              <Text small centered grey>
                {orderData.statusDescription}
              </Text>
            ) : null}
          </Group>
        </View>
      );

    case FIAT_ORDER_STATES.PENDING:
    default: {
      return (
        <View style={styles.stage}>
          <Spinner />
          <Group>
            <Text bold big primary centered>
              {order.state === FIAT_ORDER_STATES.PENDING
                ? strings('fiat_on_ramp_aggregator.order_details.processing')
                : strings('transaction.submitted')}
            </Text>

            {orderData.statusDescription ? (
              <Text small centered grey>
                {orderData.statusDescription}
              </Text>
            ) : null}
          </Group>
        </View>
      );
    }
  }
};

interface Props {
  /**
   * Object that represents the current route info like params passed to it
   */
  order: FiatOrder;
}

const OrderDetails: React.FC<Props> = ({ order }: Props) => {
  const {
    data,
    createdAt,
    amount,
    cryptoFee,
    cryptoAmount,
    currencySymbol,
    currency,
    txHash,
    cryptocurrency,
  } = order;
  const { colors } = useTheme();
  const trackEvent = useAnalytics();
  const providerConfig = useSelector(selectProviderConfig);
  const networkConfigurations = useSelector(selectNetworkConfigurations);
  const explorer = useBlockExplorer(providerConfig, networkConfigurations);
  const styles = createStyles(colors);
  const date = createdAt && toDateFormat(createdAt);
  const renderAmount = getOrderAmount(order);
  const amountOut = Number(amount) - Number(cryptoFee);

  const exchangeRate =
    (order.data as Order)?.exchangeRate ??
    Number(amountOut) / Number(cryptoAmount);
  const providerName = getProviderName(order.provider, data);

  const handleExplorerLinkPress = useCallback(
    (url: string) => {
      Linking.openURL(url);
      trackEvent('ONRAMP_EXTERNAL_LINK_CLICKED', {
        location: 'Order Details Screen',
        text: 'Etherscan Transaction',
        url_domain: url,
      });
    },
    [trackEvent],
  );

  const handleProviderLinkPress = useCallback(
    (url: string) => {
      Linking.openURL(url);
      trackEvent('ONRAMP_EXTERNAL_LINK_CLICKED', {
        location: 'Order Details Screen',
        text: 'Provider Order Tracking',
        url_domain: url,
      });
    },
    [trackEvent],
  );

  const orderData = data as Order;

  const supportLinkUrl = orderData?.provider?.links?.find(
    (link) => link.name === PROVIDER_LINKS.SUPPORT,
  )?.url;
  const orderLink = orderData?.providerOrderLink;

  return (
    <View>
      <Group>
        <Stage order={order} isTransacted={Boolean(order.sellTxHash)} />
        <Group>
          <Text bold centered primary style={styles.tokenAmount}>
            {renderAmount} {cryptocurrency}
          </Text>
          {orderData?.fiatCurrency?.decimals !== undefined && currencySymbol ? (
            <Text centered small grey>
              {currencySymbol}
              {renderFiat(amountOut, currency, orderData.fiatCurrency.decimals)}
            </Text>
          ) : (
            <Text centered small grey>
              ... {currency}
            </Text>
          )}
        </Group>

        {Boolean(orderLink) && (
          <Row>
            <TouchableOpacity
              onPress={() => handleProviderLinkPress(orderLink as string)}
            >
              <Text small centered link>
                {strings(
                  'fiat_on_ramp_aggregator.order_details.view_order_status',
                  { provider: providerName },
                )}
              </Text>
            </TouchableOpacity>
          </Row>
        )}
      </Group>
      <Group>
        <Box thin>
          <Row>
            <Account address={order.account} transparent />
          </Row>
          <Row>
            <ListItem.Content>
              <ListItem.Body style={styles.transactionIdFlex}>
                <Text black small>
                  {strings('fiat_on_ramp_aggregator.order_details.id')}
                </Text>
              </ListItem.Body>
              <ListItem.Amounts style={styles.transactionIdFlex}>
                <Text small bold primary right selectable>
                  {orderData?.providerOrderId}
                </Text>
              </ListItem.Amounts>
            </ListItem.Content>
          </Row>
          {Boolean(date) && (
            <Row>
              <ListItem.Content>
                <ListItem.Body>
                  <Text black small>
                    {strings(
                      'fiat_on_ramp_aggregator.order_details.date_and_time',
                    )}
                  </Text>
                </ListItem.Body>
                <ListItem.Amounts>
                  <Text small bold primary>
                    {date}
                  </Text>
                </ListItem.Amounts>
              </ListItem.Content>
            </Row>
          )}
          {Boolean(orderData?.paymentMethod?.name) && (
            <ListItem.Content>
              <ListItem.Body>
                <Text black small>
                  {strings(
                    order.orderType === OrderOrderTypeEnum.Buy
                      ? 'fiat_on_ramp_aggregator.order_details.payment_method'
                      : 'fiat_on_ramp_aggregator.order_details.destination',
                  )}
                </Text>
              </ListItem.Body>
              <ListItem.Amounts>
                <Text small bold primary>
                  {orderData.paymentMethod.name}
                </Text>
              </ListItem.Amounts>
            </ListItem.Content>
          )}
          {Boolean(order.provider) && (
            <Text small right grey>
              {providerName}
              {supportLinkUrl ? (
                <>
                  {' '}
                  •{' '}
                  <Text
                    small
                    right
                    underline
                    grey
                    onPress={() =>
                      handleExplorerLinkPress(supportLinkUrl as string)
                    }
                  >
                    {strings(
                      'fiat_on_ramp_aggregator.order_details.contact_support',
                    )}
                  </Text>
                </>
              ) : null}
            </Text>
          )}
          <Row>
            <ListItem.Content>
              <ListItem.Body>
                <Text black small>
                  {strings(
                    order.orderType === OrderOrderTypeEnum.Buy
                      ? 'fiat_on_ramp_aggregator.order_details.token_amount'
                      : 'fiat_on_ramp_aggregator.order_details.token_quantity_sold',
                  )}
                </Text>
              </ListItem.Body>
              <ListItem.Amounts>
                {cryptoAmount &&
                orderData?.cryptoCurrency?.decimals !== undefined ? (
                  <Text small bold primary>
                    {renderFromTokenMinimalUnit(
                      toTokenMinimalUnit(
                        cryptoAmount,
                        orderData.cryptoCurrency.decimals,
                      ).toString(),
                      orderData.cryptoCurrency.decimals,
                    )}{' '}
                    {cryptocurrency}
                  </Text>
                ) : (
                  <Text>...</Text>
                )}
              </ListItem.Amounts>
            </ListItem.Content>
          </Row>
          <Group>
            <Row>
              <ListItem.Content>
                <ListItem.Body>
                  <Text black small>
                    {strings(
                      'fiat_on_ramp_aggregator.order_details.exchange_rate',
                    )}
                  </Text>
                </ListItem.Body>
                <ListItem.Amounts style={styles.flexZero}>
                  {order.cryptocurrency &&
                  isFinite(exchangeRate) &&
                  currency ? (
                    <Text small bold primary>
                      1 {order.cryptocurrency} @{' '}
                      {renderFiat(exchangeRate, currency)}
                    </Text>
                  ) : (
                    <Text>...</Text>
                  )}
                </ListItem.Amounts>
              </ListItem.Content>
            </Row>
            <Row>
              <ListItem.Content>
                <ListItem.Body>
                  <Text black small>
                    {currency}{' '}
                    {strings(
                      order.orderType === OrderOrderTypeEnum.Buy
                        ? 'fiat_on_ramp_aggregator.order_details.amount'
                        : 'fiat_on_ramp_aggregator.order_details.value',
                    )}
                  </Text>
                </ListItem.Body>
                <ListItem.Amounts>
                  {orderData?.fiatCurrency?.decimals !== undefined &&
                  amountOut &&
                  currency ? (
                    <Text small bold primary>
                      {currencySymbol}
                      {renderFiat(
                        order.orderType === OrderOrderTypeEnum.Buy
                          ? amountOut
                          : (amount as number),
                        currency,
                        orderData.fiatCurrency.decimals,
                      )}
                    </Text>
                  ) : (
                    <Text>...</Text>
                  )}
                </ListItem.Amounts>
              </ListItem.Content>
            </Row>
          </Group>
          <Row>
            <ListItem.Content>
              <ListItem.Body>
                <Text black small>
                  {strings('fiat_on_ramp_aggregator.order_details.total_fees')}
                </Text>
              </ListItem.Body>
              <ListItem.Amounts>
                {cryptoFee &&
                currency &&
                orderData?.fiatCurrency?.decimals !== undefined ? (
                  <Text small bold primary>
                    {currencySymbol}
                    {renderFiat(
                      order.orderType === OrderOrderTypeEnum.Buy
                        ? (cryptoFee as number)
                        : orderData.totalFeesFiat,
                      currency,
                      orderData.fiatCurrency.decimals,
                    )}
                  </Text>
                ) : (
                  <Text>...</Text>
                )}
              </ListItem.Amounts>
            </ListItem.Content>
          </Row>

          <View style={styles.line} />
          <Row>
            <ListItem.Content>
              <ListItem.Body>
                <Text black small>
                  {strings(
                    order.orderType === OrderOrderTypeEnum.Buy
                      ? 'fiat_on_ramp_aggregator.order_details.purchase_amount'
                      : 'fiat_on_ramp_aggregator.order_details.amount_received_total',
                  )}
                </Text>
              </ListItem.Body>
              <ListItem.Amounts>
                {currencySymbol &&
                amount &&
                currency &&
                orderData?.fiatCurrency?.decimals !== undefined ? (
                  <Text small bold primary>
                    {currencySymbol}
                    {renderFiat(
                      order.orderType === OrderOrderTypeEnum.Buy
                        ? (amount as number)
                        : amountOut,
                      currency,
                      orderData.fiatCurrency.decimals,
                    )}
                  </Text>
                ) : (
                  <Text>...</Text>
                )}
              </ListItem.Amounts>
            </ListItem.Content>
          </Row>
          {Boolean(order.state === OrderStatusEnum.Completed && txHash) && (
            <Group>
              <TouchableOpacity
                onPress={() => handleExplorerLinkPress(explorer.tx(txHash))}
              >
                <Text blue small centered>
                  {strings('fiat_on_ramp_aggregator.order_details.etherscan')}{' '}
                  {explorer.isValid
                    ? explorer.name
                    : strings(
                        'fiat_on_ramp_aggregator.order_details.a_block_explorer',
                      )}
                </Text>
              </TouchableOpacity>
            </Group>
          )}
        </Box>
      </Group>
    </View>
  );
};

export default OrderDetails;
