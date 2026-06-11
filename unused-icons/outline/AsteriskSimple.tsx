import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgAsteriskSimple = (props: SvgProps) => (
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
    <Path d="M12 12v-9" />
    <Path d="M12 12l-9 -2.5" />
    <Path d="M12 12l9 -2.5" />
    <Path d="M12 12l6 8.5" />
    <Path d="M12 12l-6 8.5" />
  </Svg>
);
export default SvgAsteriskSimple;
