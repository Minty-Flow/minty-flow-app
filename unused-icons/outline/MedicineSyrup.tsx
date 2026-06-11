import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgMedicineSyrup = (props: SvgProps) => (
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
    <Path d="M8 21h8a1 1 0 0 0 1 -1v-10a3 3 0 0 0 -3 -3h-4a3 3 0 0 0 -3 3v10a1 1 0 0 0 1 1" />
    <Path d="M10 14h4" />
    <Path d="M12 12v4" />
    <Path d="M10 7v-3a1 1 0 0 1 1 -1h2a1 1 0 0 1 1 1v3" />
  </Svg>
);
export default SvgMedicineSyrup;
