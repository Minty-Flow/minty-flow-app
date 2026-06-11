import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgBrandDaysCounter = (props: SvgProps) => (
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
    <Path d="M20.779 10.007a9 9 0 1 0 -10.77 10.772" />
    <Path d="M13 21h8v-7" />
    <Path d="M12 8v4l3 3" />
  </Svg>
);
export default SvgBrandDaysCounter;
