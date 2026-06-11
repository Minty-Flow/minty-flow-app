import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgRollercoaster = (props: SvgProps) => (
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
    <Path d="M3 21a5.55 5.55 0 0 0 5.265 -3.795l.735 -2.205a8.775 8.775 0 0 1 8.325 -6h3.675" />
    <Path d="M20 9v12" />
    <Path d="M8 21v-3" />
    <Path d="M12 21v-10" />
    <Path d="M16 9.5v11.5" />
    <Path d="M15 3h5v3h-5l0 -3" />
    <Path d="M6 8l4 -3l2 2.5l-4 3l-1.8 -.5l-.2 -2" />
  </Svg>
);
export default SvgRollercoaster;
