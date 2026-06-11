import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgH2 = (props: SvgProps) => (
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
    <Path d="M17 12a2 2 0 1 1 4 0c0 .591 -.417 1.318 -.816 1.858l-3.184 4.143l4 0" />
    <Path d="M4 6v12" />
    <Path d="M12 6v12" />
    <Path d="M11 18h2" />
    <Path d="M3 18h2" />
    <Path d="M4 12h8" />
    <Path d="M3 6h2" />
    <Path d="M11 6h2" />
  </Svg>
);
export default SvgH2;
