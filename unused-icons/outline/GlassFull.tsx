import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgGlassFull = (props: SvgProps) => (
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
    <Path d="M8 21l8 0" />
    <Path d="M12 15l0 6" />
    <Path d="M17 3l1 7c0 3.012 -2.686 5 -6 5s-6 -1.988 -6 -5l1 -7h10" />
    <Path d="M6 10a5 5 0 0 1 6 0a5 5 0 0 0 6 0" />
  </Svg>
);
export default SvgGlassFull;
