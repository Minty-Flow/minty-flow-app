import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgUmbrella = (props: SvgProps) => (
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
    <Path d="M4 12a8 8 0 0 1 16 0l-16 0" />
    <Path d="M12 12v6a2 2 0 0 0 4 0" />
  </Svg>
);
export default SvgUmbrella;
