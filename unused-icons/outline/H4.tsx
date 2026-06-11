import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgH4 = (props: SvgProps) => (
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
    <Path d="M20 18v-8l-4 6h5" />
    <Path d="M4 6v12" />
    <Path d="M12 6v12" />
    <Path d="M11 18h2" />
    <Path d="M3 18h2" />
    <Path d="M4 12h8" />
    <Path d="M3 6h2" />
    <Path d="M11 6h2" />
  </Svg>
);
export default SvgH4;
