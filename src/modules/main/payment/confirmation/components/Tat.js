import React from "react";
import { Text } from "react-native-paper";

import { durationToHumanReadable } from "../../../../../utils/utils";

const Tat = ({ duration }) => {
  const { timeDuration, unit } = durationToHumanReadable(duration);

  return (
    <Text>
      Estimated Delivery Time:&nbsp;
      <Text variant="titleSmall">
        {timeDuration} {unit}
      </Text>
    </Text>
  );
};

export default Tat;
