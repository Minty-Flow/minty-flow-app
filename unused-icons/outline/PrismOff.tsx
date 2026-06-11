import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgPrismOff = (props: SvgProps) => (
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
    <Path d="M12 12v10" />
    <Path d="M17.957 17.952l-4.937 3.703a1.7 1.7 0 0 1 -2.04 0l-5.98 -4.485a2.5 2.5 0 0 1 -1 -2v-11.17m3 -1h12a1 1 0 0 1 1 1v11.17c0 .25 -.037 .495 -.109 .729" />
    <Path d="M12.688 8.7a1.7 1.7 0 0 0 .357 -.214l6.655 -5.186" />
    <Path d="M3 3l18 18" />
  </Svg>
);
export default SvgPrismOff;
