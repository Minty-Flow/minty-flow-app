import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgBolt = (props: SvgProps) => (
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
    <Path d="M13 3l0 7l6 0l-8 11l0 -7l-6 0l8 -11" />
  </Svg>
);
export default SvgBolt;
