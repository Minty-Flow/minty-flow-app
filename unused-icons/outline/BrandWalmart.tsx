import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgBrandWalmart = (props: SvgProps) => (
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
    <Path d="M12 8.04v-5.04" />
    <Path d="M15.5 10l4.5 -2.5" />
    <Path d="M15.5 14l4.5 2.5" />
    <Path d="M12 15.96v5.04" />
    <Path d="M8.5 14l-4.5 2.5" />
    <Path d="M8.5 10l-4.5 -2.505" />
  </Svg>
);
export default SvgBrandWalmart;
