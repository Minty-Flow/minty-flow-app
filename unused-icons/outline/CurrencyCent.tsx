import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgCurrencyCent = (props: SvgProps) => (
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
    <Path d="M16.007 7.54a5.965 5.965 0 0 0 -4.008 -1.54a6 6 0 0 0 -5.992 6c0 3.314 2.682 6 5.992 6a5.965 5.965 0 0 0 4 -1.536" />
    <Path d="M12 20v-2" />
    <Path d="M12 6v-2" />
  </Svg>
);
export default SvgCurrencyCent;
