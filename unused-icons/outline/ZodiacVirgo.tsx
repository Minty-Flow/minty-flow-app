import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgZodiacVirgo = (props: SvgProps) => (
  <Svg
    width={24}
    height={24}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <Path d="M3 4a2 2 0 0 1 2 2v9" />
    <Path d="M5 6a2 2 0 0 1 4 0v9" />
    <Path d="M9 6a2 2 0 0 1 4 0v10a7 5 0 0 0 7 5" />
    <Path d="M12 21a7 5 0 0 0 7 -5v-2a3 3 0 0 0 -6 0" />
  </Svg>
);
export default SvgZodiacVirgo;
