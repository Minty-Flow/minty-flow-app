import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgLemon = (props: SvgProps) => (
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
    <Path d="M17.536 3.393c3.905 3.906 3.905 10.237 0 14.143c-3.906 3.905 -10.237 3.905 -14.143 0l14.143 -14.143" />
    <Path d="M5.868 15.06a6.5 6.5 0 0 0 9.193 -9.192" />
    <Path d="M10.464 10.464l4.597 4.597" />
    <Path d="M10.464 10.464v6.364" />
    <Path d="M10.464 10.464h6.364" />
  </Svg>
);
export default SvgLemon;
