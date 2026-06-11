import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgBaselineDensitySmall = (props: SvgProps) => (
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
    <Path d="M4 3h16" />
    <Path d="M4 9h16" />
    <Path d="M4 15h16" />
    <Path d="M4 21h16" />
  </Svg>
);
export default SvgBaselineDensitySmall;
