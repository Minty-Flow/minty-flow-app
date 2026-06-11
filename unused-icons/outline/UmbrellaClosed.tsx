import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgUmbrellaClosed = (props: SvgProps) => (
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
    <Path d="M9 16l3 -13l3 13l-6 0" />
    <Path d="M12 16v3c0 2.667 4 2.667 4 0" />
  </Svg>
);
export default SvgUmbrellaClosed;
