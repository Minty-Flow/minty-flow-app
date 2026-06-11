import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgClockPlay = (props: SvgProps) => (
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
    <Path d="M12 7v5l2 2" />
    <Path d="M17 22l5 -3l-5 -3l0 6" />
    <Path d="M13.017 20.943a9 9 0 1 1 7.831 -7.292" />
  </Svg>
);
export default SvgClockPlay;
