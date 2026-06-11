import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgReservedLine = (props: SvgProps) => (
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
    <Path d="M9 20h6" />
    <Path d="M12 14v6" />
    <Path d="M4 6a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v6a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2l0 -6" />
    <Path d="M9 9h6" />
  </Svg>
);
export default SvgReservedLine;
