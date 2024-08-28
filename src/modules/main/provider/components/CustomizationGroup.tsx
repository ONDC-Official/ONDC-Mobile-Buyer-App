import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {Checkbox, Text, RadioButton} from 'react-native-paper';
import React, {useState} from 'react';
import FastImage from 'react-native-fast-image';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {useTranslation} from 'react-i18next';

import {useAppTheme} from '../../../../utils/theme';
import useFormatNumber from '../../../../hooks/useFormatNumber';

const VegImage = require('../../../../assets/veg.png');
const NonVegImage = require('../../../../assets/veg.png');
const VegNonVegTag = ({category = 'veg'}) => {
  return (
    <FastImage
      source={category === 'veg' ? VegImage : NonVegImage}
      style={{width: 18, height: 18}}
    />
  );
};

const CustomizationGroup = ({
  group,
  customizationState,
  customizationGroups,
  handleClick,
}: {
  group: any;
  customizationState: any;
  customizationGroups: any;
  handleClick: (group: any, option: any) => void;
}) => {
  const {formatNumber} = useFormatNumber();
  const {t} = useTranslation();
  const theme = useAppTheme();
  const styles = makeStyles(theme.colors);
  const [showAll, setShowAll] = useState<boolean>(false);

  if (!group) {
    return <></>;
  }
  const customizationGroup = customizationGroups.find(
    (one: any) => one.id === group?.id,
  );

  const totalRecords = group?.options?.length;
  const options: any[] = showAll ? group?.options : group?.options?.slice(0, 4);

  return (
    <View key={group?.id}>
      <View style={styles.filterContainer}>
        <View style={styles.groupHeader}>
          <View style={styles.groupMeta}>
            <Text variant={'bodyLarge'} style={styles.groupName}>
              {group?.name}
            </Text>
            {customizationGroup?.minQuantity !== 0 &&
            customizationGroup?.maxQuantity !== 0 &&
            customizationGroup?.minQuantity !==
              customizationGroup?.maxQuantity ? (
              <Text variant={'labelSmall'} style={styles.selectionLabel}>
                {t('Customisation.Select any and upto', {
                  minQuantity: customizationGroup.minQuantity,
                  maxQuantity: customizationGroup?.maxQuantity,
                })}
              </Text>
            ) : customizationGroup?.minQuantity !== 0 ? (
              <Text variant={'labelSmall'} style={styles.selectionLabel}>
                {t('Customisation.Select any', {
                  minQuantity: customizationGroup.minQuantity,
                })}
              </Text>
            ) : customizationGroup?.maxQuantity !== 0 ? (
              <Text variant={'labelSmall'} style={styles.selectionLabel}>
                {t('Customisation.Select upto', {
                  maxQuantity: customizationGroup.maxQuantity,
                })}
              </Text>
            ) : (
              <></>
            )}
          </View>
          {group?.isMandatory && (
            <View>
              <View style={styles.mandatory}>
                <Text variant={'labelLarge'} style={styles.mandatoryLabel}>
                  {t('Cart.Required')}
                </Text>
              </View>
            </View>
          )}
        </View>
        <View style={styles.groupContainer}>
          {options.map((option: any) => {
            const selected =
              group?.selected?.some(
                (selectedOption: any) => selectedOption?.id === option?.id,
              ) ?? false;

            return (
              <View key={option.id} style={styles.optionContainer}>
                <View style={styles.meta}>
                  <VegNonVegTag category={option.vegNonVeg} />
                  <Text
                    variant={selected ? 'labelLarge' : 'labelMedium'}
                    style={styles.option}>
                    {option.name}
                  </Text>
                </View>
                <View style={styles.optionActionContainer}>
                  {option.inStock ? (
                    <View style={styles.optionActionContainer}>
                      <Text
                        variant={selected ? 'labelLarge' : 'labelMedium'}
                        style={styles.amount}>
                        ₹{formatNumber(option.price)}
                      </Text>
                      {group?.type === 'Radio' ? (
                        <RadioButton.Android
                          status={selected ? 'checked' : 'unchecked'}
                          onPress={() => {
                            if (option.inStock) {
                              handleClick(group, option);
                            }
                          }}
                          value={formatNumber(option.price)}
                        />
                      ) : (
                        <Checkbox.Android
                          status={selected ? 'checked' : 'unchecked'}
                          onPress={() => {
                            if (option.inStock) {
                              handleClick(group, option);
                            }
                          }}
                        />
                      )}
                    </View>
                  ) : (
                    <Text variant={'labelMedium'} style={styles.outOfStock}>
                      Out of Stock
                    </Text>
                  )}
                </View>
              </View>
            );
          })}
          {showAll ? (
            <TouchableOpacity
              style={styles.toggleButton}
              onPress={() => setShowAll(!showAll)}>
              <Text variant={'labelLarge'} style={styles.toggleButtonLabel}>
                View Less
              </Text>
              <Icon
                name={'chevron-up'}
                size={16}
                color={theme.colors.primary}
              />
            </TouchableOpacity>
          ) : totalRecords > 4 ? (
            <TouchableOpacity
              style={styles.toggleButton}
              onPress={() => setShowAll(!showAll)}>
              <Text variant={'labelLarge'} style={styles.toggleButtonLabel}>
                {totalRecords - options.length} more
              </Text>
              <Icon
                name={'chevron-down'}
                size={16}
                color={theme.colors.primary}
              />
            </TouchableOpacity>
          ) : (
            <></>
          )}
        </View>
      </View>
      {group?.childs &&
        group?.childs.map((child: any) => (
          <CustomizationGroup
            key={child}
            group={customizationState[child]}
            customizationState={customizationState}
            customizationGroups={customizationGroups}
            handleClick={handleClick}
          />
        ))}
    </View>
  );
};

const makeStyles = (colors: any) =>
  StyleSheet.create({
    filterContainer: {
      padding: 12,
      backgroundColor: colors.white,
      borderRadius: 12,
      marginBottom: 16,
      borderWidth: 1,
      borderColor: colors.neutral100,
    },
    optionContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    meta: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
    },
    optionActionContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    option: {
      color: colors.neutral400,
      paddingHorizontal: 8,
      flex: 1,
    },
    amount: {
      color: colors.neutral400,
    },
    outOfStock: {
      color: colors.error600,
    },
    groupName: {
      color: colors.neutral400,
    },
    selectionLabel: {
      color: colors.neutral300,
    },
    groupContainer: {
      borderRadius: 2,
      paddingVertical: 6,
    },
    groupHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      borderBottomColor: colors.neutral100,
      borderBottomWidth: 1,
      alignItems: 'center',
      paddingBottom: 8,
    },
    groupMeta: {
      flex: 1,
      paddingRight: 8,
    },
    mandatory: {
      paddingVertical: 6,
      paddingHorizontal: 10,
      borderRadius: 6,
      backgroundColor: colors.warning600,
    },
    mandatoryLabel: {
      color: colors.white,
    },
    toggleButton: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 6,
    },
    toggleButtonLabel: {
      color: colors.primary,
      marginRight: 8,
    },
  });

export default CustomizationGroup;
