import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgArrowNarrowDownDashed = (props: SvgProps) => (
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
    <Path d="M12 5v.5m0 3v1.5m0 3v6" />
    <Path d="M16 15l-4 4" />
    <Path d="M8 15l4 4" />
  </Svg>
);
export default SvgArrowNarrowDownDashed;
