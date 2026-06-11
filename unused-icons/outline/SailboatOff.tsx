import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgSailboatOff = (props: SvgProps) => (
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
    <Path d="M2 20a2.4 2.4 0 0 0 2 1a2.4 2.4 0 0 0 2 -1a2.4 2.4 0 0 1 2 -1a2.4 2.4 0 0 1 2 1a2.4 2.4 0 0 0 2 1a2.4 2.4 0 0 0 2 -1a2.4 2.4 0 0 1 2 -1a2.4 2.4 0 0 1 2 1a2.4 2.4 0 0 0 2 1a2.4 2.4 0 0 0 2 -1" />
    <Path d="M4 18l-1 -3h12m4 0h2l-.506 1.517" />
    <Path d="M11 11v1h1m4 0h2l-7 -9v4" />
    <Path d="M7.713 7.718l-1.713 4.282" />
    <Path d="M3 3l18 18" />
  </Svg>
);
export default SvgSailboatOff;
