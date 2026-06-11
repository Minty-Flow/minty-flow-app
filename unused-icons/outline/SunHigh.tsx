import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgSunHigh = (props: SvgProps) => (
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
    <Path d="M14.828 14.828a4 4 0 1 0 -5.656 -5.656a4 4 0 0 0 5.656 5.656" />
    <Path d="M6.343 17.657l-1.414 1.414" />
    <Path d="M6.343 6.343l-1.414 -1.414" />
    <Path d="M17.657 6.343l1.414 -1.414" />
    <Path d="M17.657 17.657l1.414 1.414" />
    <Path d="M4 12h-2" />
    <Path d="M12 4v-2" />
    <Path d="M20 12h2" />
    <Path d="M12 20v2" />
  </Svg>
);
export default SvgSunHigh;
