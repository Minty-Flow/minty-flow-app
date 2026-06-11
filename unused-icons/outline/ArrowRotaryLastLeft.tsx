import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgArrowRotaryLastLeft = (props: SvgProps) => (
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
    <Path d="M15 15a3 3 0 1 1 0 -6a3 3 0 0 1 0 6" />
    <Path d="M15 15v6" />
    <Path d="M12.5 9.5l-6.5 -6.5" />
    <Path d="M11 3h-5v5" />
  </Svg>
);
export default SvgArrowRotaryLastLeft;
