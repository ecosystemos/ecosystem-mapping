import { fonts } from "./fonts/fonts";
import { colors } from "./colors/colors";
import { text } from "./components/text";
import { input } from "./components/input";
import { button } from "./components/button";
import { extendTheme, withDefaultColorScheme } from "@chakra-ui/react";

export const theme = extendTheme(
  withDefaultColorScheme({ colorScheme: "brand" }),
  {
    fonts: fonts,
    colors: colors,
    components: {
      Text: text,
      Button: button,
      Input: input,
    },
  }
);
