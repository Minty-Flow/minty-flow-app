import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgGlass = (props: SvgProps) => (
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
    <Path d="M8 21h8" />
    <Path d="M12 16v5" />
    <Path d="M17 5l1 6c0 3.012 -2.686 5 -6 5s-6 -1.988 -6 -5l1 -6" />
    <Path d="M7 5a5 2 0 1 0 10 0a5 2 0 1 0 -10 0" />
  </Svg>
);
export default SvgGlass;
