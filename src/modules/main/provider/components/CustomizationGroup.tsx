import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {Checkbox, Text, useTheme} from 'react-native-paper';
import React, {useState} from 'react';
import FastImage from 'react-native-fast-image';
import Icon from 'react-native-vector-icons/FontAwesome5';

const VegNonVegTag = ({category = 'veg'}) => {
  return (
    <FastImage
      source={
        category === 'veg'
          ? require('../../../../assets/veg.png')
          : require('../../../../assets/non_veg.png')
      }
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
  const theme = useTheme();
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
          <View>
            <Text variant={'bodyMedium'} style={styles.groupName}>
              {group?.name}
            </Text>
            <Text variant={'labelSmall'} style={styles.selectionLabel}>
              {customizationGroup?.minQuantity === 0
                ? `Select upto ${customizationGroup?.maxQuantity} options`
                : `Select any ${customizationGroup.minQuantity} - ${customizationGroup.maxQuantity} of ${totalRecords}`}
            </Text>
          </View>
          {group?.isMandatory && (
            <View>
              <View style={styles.mandatory}>
                <Text variant={'labelMedium'} style={styles.mandatoryLabel}>
                  Required
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
                    variant={'labelMedium'}
                    style={[styles.option, selected ? styles.bold : {}]}>
                    {option.name}
                  </Text>
                </View>
                <View style={styles.optionActionContainer}>
                  {option.inStock ? (
                    <View style={styles.optionActionContainer}>
                      <Text
                        variant={'labelMedium'}
                        style={[styles.option, selected ? styles.bold : {}]}>
                        ₹{option.price}
                      </Text>
                      <Checkbox.Android
                        status={selected ? 'checked' : 'unchecked'}
                        onPress={() => {
                          if (option.inStock) {
                            handleClick(group, option);
                          }
                        }}
                      />
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
              <Text variant={'labelMedium'} style={styles.toggleButtonLabel}>
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
              <Text variant={'labelMedium'} style={styles.toggleButtonLabel}>
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
      backgroundColor: '#fff',
      borderRadius: 12,
      marginBottom: 16,
      borderWidth: 1,
      borderColor: '#E8E8E8',
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
      color: '#222',
      paddingLeft: 8,
    },
    bold: {
      fontWeight: 'bold',
    },
    outOfStock: {
      color: colors.error,
    },
    groupName: {
      color: '#1A1A1A',
      fontWeight: '600',
    },
    selectionLabel: {
      color: '#686868',
    },
    groupContainer: {
      borderRadius: 2,
      paddingVertical: 6,
    },
    groupHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      borderBottomColor: '#E8E8E8',
      borderBottomWidth: 1,
      alignItems: 'center',
      paddingBottom: 13,
    },
    mandatory: {
      padding: 10,
      borderRadius: 6,
      backgroundColor: '#F9C51C',
    },
    mandatoryLabel: {
      fontWeight: '600',
      color: '#fff',
    },
    toggleButton: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 6,
    },
    toggleButtonLabel: {
      color: colors.primary,
      marginRight: 8,
      fontWeight: '600',
    },
  });

export default CustomizationGroup;
